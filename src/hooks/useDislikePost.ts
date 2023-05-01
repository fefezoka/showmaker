import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { PostPagination } from '../@types/types';
import { getQueryKey } from '@trpc/react-query';
import { trpc } from '@utils';

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.posts.dislike.useMutation({
    onMutate: ({ post }) => {
      const newPost = produce(post, (draft) => {
        draft.likes -= 1;
        draft.isLiked = false;
      });

      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      utils.posts.byId.setData({ postId: post.id }, newPost);

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
    },
  });
};
