import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  postId: string;
  commentId: string;
}

export const useDeletePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, commentId }: Props) =>
      await axios.post('/api/post/delete-comment', {
        postId,
        commentId,
      }),
    {
      onMutate: ({ commentId, postId }) => {
        queryClient.setQueryData<PostComment[] | undefined>(
          ['comments', postId],
          (old) => old && old.filter((comments) => comments.id !== commentId)
        );
      },
    }
  );
};
