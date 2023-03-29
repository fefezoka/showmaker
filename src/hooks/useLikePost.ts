import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
  post: Post;
}

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async ({ post }: Props) => {
      await axios.post('/api/post/like', {
        postId: post.id,
        userId: session?.user.id,
      });
    },
    {
      onMutate: ({ post }) => {
        queryClient.setQueryData<Post | undefined>(
          ['post', post.id],
          (old) =>
            old && {
              ...old,
              likes: old.likes + 1,
              isLiked: true,
            }
        );

        const queries = [
          'homepagePosts',
          ['feed', post.game],
          ['userposts', post.user.name],
          ['favorites', post.user.name],
        ];

        queries.forEach((query) => {
          const homepagePosts = queryClient.getQueryData<PostsPagination>(query);
          homepagePosts &&
            queryClient.setQueryData<PostsPagination>(query, {
              pages: homepagePosts?.pages.map((page) =>
                page.map((postcache) => {
                  if (postcache.id === post.id) {
                    return {
                      ...postcache,
                      isLiked: true,
                      likes: postcache.likes + 1,
                    };
                  }
                  return postcache;
                })
              ),
            });
        });

        const oldFavorites = queryClient.getQueryData<PostsPagination>([
          'favorites',
          session?.user.name,
        ]);

        oldFavorites &&
          queryClient.setQueryData<PostsPagination>(
            ['favorites', session?.user.name],
            !oldFavorites.pages[0].some((cachepost) => cachepost.id === post.id) &&
              oldFavorites?.pages[0].unshift(post)
              ? oldFavorites
              : oldFavorites
          );
      },
    }
  );
};
