import produce from 'immer';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { PostPagination, Post } from '@types';
import { trpc } from '@utils';

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.posts.edit.useMutation({
    onMutate: ({ postId, title, game }) => {
      const infiniteQueries = queryClient.getQueriesData(getQueryKey(trpc.posts.feed));

      infiniteQueries.forEach((query) =>
        queryClient.setQueriesData<PostPagination>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages.forEach((page) => {
                page.posts.forEach((postcache) => {
                  if (postcache.id === postId) {
                    if (title) {
                      postcache.title = title;
                    }

                    if (game) {
                      postcache.game = game;
                    }
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
            if (title) {
              draft.title = title;
            }

            if (game) {
              draft.game = game;
            }
          })
      );
    },
  });
};
