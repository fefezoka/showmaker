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

        queryClient.setQueryData<Post>(['post', post.id], newPost);

        queryClient.setQueriesData<PostsPagination>(
          ['posts'],
          (old) =>
            old && {
              pages: old.pages.map((page) =>
                page.map((postcache) => {
                  if (postcache.id === post.id) {
                    return newPost;
                  }
                  return postcache;
                })
              ),
            }
        );
      },
    }
  );
};
