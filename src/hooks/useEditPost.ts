import produce from 'immer';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { PostPagination } from 'src/@types/types';
import { trpc } from '@utils';

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.posts.edit.useMutation({
    onMutate: ({ postId, title }) => {
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
                page.posts.forEach((postcache) => {
                  if (postcache.id === postId) {
                    postcache.title = title;
                  }
                });
              });
            })
        )
      );

      utils.posts.byId.setData(
        { postId },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.title = title;
          })
      );
    },
  });
};
