import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

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
        queryClient.setQueryData<PostComment[]>(
          ['comments', postId],
          (old) => old && old.filter((comment) => comment.id !== commentId)
        );

        queryClient.setQueryData<Post>(
          ['post', postId],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.commentsAmount -= 1;
            })
        );
      },
    }
  );
};
