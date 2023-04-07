import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

interface Props {
  postId: string;
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId }: Props) =>
      await axios.post('api/post/remove', {
        postId,
      }),
    {
      onMutate: ({ postId }) => {
        queryClient.setQueriesData<PostsPagination>(
          ['posts'],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.pages = draft.pages.map((page) =>
                page.filter((postcache) => postcache.id !== postId)
              );
            })
        );
      },
    }
  );
};
