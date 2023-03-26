import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  postId: string;
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async ({ postId }: Props) => {
      await axios.post('/api/post/like', {
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
              likes: old.likes + 1,
              isLiked: true,
            }
        );

        const oldFavorites = queryClient.getQueryData<PostsPagination>([
          'favorites',
          session?.user.name,
        ]);

        oldFavorites &&
          queryClient.setQueryData<PostsPagination>(
            ['favorites', session?.user.name],
            !oldFavorites.pages[0].some((cachepost) => cachepost.id === postId) &&
              oldFavorites?.pages[0].unshift({ id: postId })
              ? oldFavorites
              : oldFavorites
          );
      },
    }
  );
};
