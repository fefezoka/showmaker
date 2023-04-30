import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { getQueryKey } from '@trpc/react-query';
import { useSession } from 'next-auth/react';
import { trpc } from '@utils';
import { PostPagination } from '@types';

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
        utils.posts.infinitePosts.feed.setInfiniteData(
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
};
