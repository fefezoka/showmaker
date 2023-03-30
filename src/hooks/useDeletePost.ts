import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

interface Props {
  postId: string;
  game: string;
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async ({ postId, game }: Props) =>
      await axios.post('api/post/remove', {
        postId,
      }),
    {
      onMutate: ({ postId, game }) => {
        [
          ['homepagePosts'],
          ['feed', game],
          ['userposts', session?.user.name],
          ['favorites', session?.user.name],
        ].forEach((query) => {
          queryClient.setQueryData<PostsPagination>(
            query,
            (old) =>
              old &&
              produce(old, (draft) => {
                draft.pages = draft.pages.map((page) =>
                  page.filter((postcache) => postcache.id !== postId)
                );
              })
          );
        });
      },
    }
  );
};
