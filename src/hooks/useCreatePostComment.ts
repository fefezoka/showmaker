import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

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
      onSuccess: ({ data }, { postId }) => {
        queryClient.setQueryData<PostComment[]>(['comments', data.postId], (old) =>
          old
            ? produce(old, (draft) => {
                draft.unshift(data);
              })
            : [data]
        );

        queryClient.setQueryData<Post>(
          ['post', postId],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.commentsAmount += 1;
            })
        );
      },
    }
  );
};
