import { produce } from 'immer';
import { trpc } from '@utils';

export const useDeletePostComment = () => {
  const utils = trpc.useContext();

  return trpc.posts.deleteComment.useMutation({
    onMutate: ({ commentId, postId }) => {
      utils.posts.comments.setData(
        { postId },
        (old) => old && old.filter((comment) => comment.id !== commentId)
      );

      utils.posts.byId.setData(
        { postId },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.commentsAmount -= 1;
          })
      );
    },
  });
};
