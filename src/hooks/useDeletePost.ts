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
        const feedPosts = queryClient.getQueryData<PostsPagination>(['homepageIds']);
        feedPosts &&
          queryClient.setQueryData<PostsPagination>(['homepageIds'], {
            ...feedPosts,
            pages: feedPosts.pages.map((page) =>
              page.filter((postcache) => postcache.id !== postId)
            ),
          });

        const specificFeedPosts = queryClient.getQueryData<PostsPagination>([
          'feed',
          game,
        ]);
        specificFeedPosts &&
          queryClient.setQueryData<PostsPagination>(['feed', game], {
            ...specificFeedPosts,
            pages: specificFeedPosts.pages.map((page) =>
              page.filter((postcache) => postcache.id !== postId)
            ),
          });

        const userPosts = queryClient.getQueryData<PostsPagination>([
          'userposts',
          session?.user.name,
        ]);
        userPosts &&
          queryClient.setQueryData<PostsPagination>(['userposts', session?.user.name], {
            ...userPosts,
            pages: userPosts.pages.map((page) =>
              page.filter((postcache) => postcache.id !== postId)
            ),
          });

        const userFavoritePosts = queryClient.getQueryData<PostsPagination>([
          'favorites',
          session?.user.name,
        ]);
        userFavoritePosts &&
          queryClient.setQueryData<PostsPagination>(['favorites', session?.user.name], {
            ...userFavoritePosts,
            pages: userFavoritePosts.pages.map((page) =>
              page.filter((postcache) => postcache.id !== postId)
            ),
          });
      },
    }
  );
};
