import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  game: string;
}

export const useCreatePost = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ game, thumbnailUrl, title, videoUrl }: Props) =>
      await axios.post<Post>('/api/post/insert', {
        ...session?.user,
        title,
        thumbnailUrl,
        videoUrl,
        game,
      }),
    {
      onSuccess: ({ data }) => {
        const oldHomepageIds = queryClient.getQueryData<PostsPagination>('homepageIds');
        oldHomepageIds &&
          queryClient.setQueryData<PostsPagination>(
            'homepageIds',
            oldHomepageIds.pages[0].unshift({ id: data.id })
              ? oldHomepageIds
              : oldHomepageIds
          );

        const oldSpecificGameHomepage = queryClient.getQueryData<PostsPagination>([
          'feed',
          data.game,
        ]);
        oldSpecificGameHomepage &&
          queryClient.setQueryData<PostsPagination>(
            ['feed', data.game],
            oldSpecificGameHomepage.pages[0].unshift({ id: data.id })
              ? oldSpecificGameHomepage
              : oldSpecificGameHomepage
          );

        const oldProfilePosts = queryClient.getQueryData<PostsPagination>([
          'userposts',
          session?.user.name,
        ]);
        oldProfilePosts &&
          queryClient.setQueryData<PostsPagination>(
            ['userposts', session?.user.name],
            oldProfilePosts?.pages[0].unshift({ id: data.id })
              ? oldProfilePosts
              : oldProfilePosts
          );

        queryClient.setQueryData<Post>(['post', data.id], data);
      },
    }
  );
};
