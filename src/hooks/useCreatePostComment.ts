import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  postId: string;
  message: string;
}

export const useCreatePostComment = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ postId, message }: Props) =>
      await axios.post<PostComment>('/api/post/new-comment', {
        postId,
        userId: session?.user.id,
        message: message,
      }),
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData<PostComment[]>(['comments', data.postId], (old) => [
          data,
          ...(old ? old : []),
        ]);
      },
      onMutate: ({ postId }) => {
        queryClient.setQueryData<Post | undefined>(
          ['post', postId],
          (old) =>
            old && {
              ...old,
              commentsAmount: old.commentsAmount + 1,
            }
        );
      },
    }
  );
};
