import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  postId: string;
}

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async ({ postId }: Props) => {
      await axios.post('/api/post/dislike', {
        postId,
        userId: session?.user.id,
      });
    },
    {
      onMutate: ({ postId }) => {
        queryClient.setQueryData<Post | undefined>(
          ['post', postId],
          (old) =>
            old && {
              ...old,
              likes: old.likes - 1,
              isLiked: false,
            }
        );
      },
    }
  );
};
