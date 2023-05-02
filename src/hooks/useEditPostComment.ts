import { trpc } from '@utils';
import produce from 'immer';

export const useEditPostComment = () => {
  const utils = trpc.useContext();

  return trpc.posts.editComment.useMutation({
    onMutate: ({ commentId, message, postId }) => {
      utils.posts.comments.setData(
        { postId },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.forEach((comment) => {
              if (comment.id === commentId) {
                comment.message = message;
              }
            });
          })
      );
    },
  });
};
