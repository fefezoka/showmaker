import { useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import { trpc } from '../utils/trpc';
import { getQueryKey } from '@trpc/react-query';
import { PostPagination } from '../@types/types';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return trpc.posts.delete.useMutation({
    onMutate: ({ postId }) => {
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
                page.posts = page.posts.filter((postcache) => postcache.id !== postId);
              });
            })
        )
      );
    },
  });
};
