import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

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
        const queries = [
          ['homepagePosts'],
          ['feed', game],
          ['userposts', session?.user.name],
          ['favorites', session?.user.name],
        ];

        queries.forEach((query) => {
          const posts = queryClient.getQueryData<PostsPagination>(query);
          posts &&
            queryClient.setQueryData<PostsPagination>(query, {
              ...posts,
              pages: posts.pages.map((page) =>
                page.filter((postcache) => postcache.id !== postId)
              ),
            });
        });
      },
    }
  );
};
