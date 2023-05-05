import { trpc } from '@utils';

export const useDeletePostComment = () => {
  const utils = trpc.useContext();

  return trpc.posts.deleteComment.useMutation({
    onMutate: ({ commentId, postId }) => {
      utils.posts.comments.setData(
        { postId },
        (old) => old && old.filter((comment) => comment.id !== commentId)
      );
    },
  });
};
