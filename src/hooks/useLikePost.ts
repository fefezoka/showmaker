import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

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
        const newPost = produce(post, (draft) => {
          draft.isLiked = true;
          draft.likes += 1;
        });

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

        queryClient.setQueryData<PostsPagination>(
          ['posts', 'favorites', session?.user.name],
          (old) =>
            old &&
            produce(old, (draft) => {
              !draft.pages.some((page) =>
                page.some((postcache) => postcache.id === post.id)
              ) && draft.pages[0].unshift(newPost);
            })
        );

        queryClient.setQueryData<Post>(['post', post.id], newPost);
      },
    }
  );
};
