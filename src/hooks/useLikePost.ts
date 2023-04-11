import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { getQueryKey } from '@trpc/react-query';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import { PostPagination } from '../common/types';

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();
  const { data: session } = useSession();

  return trpc.posts.like.useMutation({
    onMutate: ({ post }) => {
      const newPost = produce(post, (draft) => {
        draft.isLiked = true;
        draft.likes += 1;
      });

      const infiniteQueries = queryClient.getQueriesData(
        getQueryKey(trpc.posts.infinitePosts)
      );

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.map((page) => {
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
        utils.posts.infinitePosts.user.profile.setInfiniteData(
          { name: session.user.name, feed: 'favorites' },
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages[0].posts.unshift(newPost);
            })
        );

      utils.posts.byId.setData({ postId: post.id }, newPost);
    },
  });
};
