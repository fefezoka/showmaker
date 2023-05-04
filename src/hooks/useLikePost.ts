import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { getQueryKey } from '@trpc/react-query';
import { signIn, useSession } from 'next-auth/react';
import { trpc } from '@utils';
import { PostPagination } from '@types';
import { ReactQueryOptions, RouterInputs } from 'src/server/trpc';

type LikeInputs = RouterInputs['posts']['like'];
type LikeConfig = ReactQueryOptions['posts']['like'];

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const like = trpc.posts.like.useMutation({
    onMutate: ({ post }) => {
      const newPost = produce(post, (draft) => {
        draft.isLiked = true;
        draft.likes += 1;
      });

      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.forEach((page) => {
                page.posts = page.posts.map((postcache) => {
                  if (postcache.id === post.id) {
                    return newPost;
                  }
                  return postcache;
                });
              });
            })
        )
      );

      session &&
        utils.posts.feed.user.setInfiniteData(
          { username: session.user.name, feed: 'favorites' },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].posts.unshift(newPost);
            })
        );

      utils.posts.byId.setData({ postId: post.id }, newPost);
    },
  });

  const mutateAsync = async (input: LikeInputs, config?: LikeConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return await like.mutateAsync({ ...input }, { ...config });
  };

  const mutate = (input: LikeInputs, config?: LikeConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return like.mutate({ ...input }, { ...config });
  };

  return {
    ...like,
    mutate,
    mutateAsync,
  };
};
