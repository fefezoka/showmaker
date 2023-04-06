import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

interface Props {
  post: Post;
}

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async ({ post }: Props) => {
      await axios.post('/api/post/dislike', {
        postId: post.id,
        userId: session?.user.id,
      });
    },
    {
      onMutate: ({ post }) => {
        const newPost = produce(post, (draft) => {
          draft.likes -= 1;
          draft.isLiked = false;
        });

        const updateData = (old: PostsPagination) => {
          return {
            pages: old.pages.map((page) =>
              page.map((postcache) => {
                if (postcache.id === post.id) {
                  return newPost;
                }
                return postcache;
              })
            ),
          };
        };

        queryClient.setQueryData<Post>(['post', post.id], newPost);

        [
          ['homepagePosts'],
          ['feed', post.game],
          ['userposts', post.user.name],
          ['favorites', post.user.name],
        ].forEach((query) => {
          queryClient.setQueryData<PostsPagination>(
            query,
            (old) => old && updateData(old)
          );
        });

        queryClient.setQueriesData<PostsPagination>(
          ['search'],
          (old) => old && updateData(old)
        );
      },
    }
  );
};
