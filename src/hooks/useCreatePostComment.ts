import { produce } from 'immer';
import { trpc } from '../utils/trpc';

export const useCreatePostComment = () => {
  const utils = trpc.useContext();

  return trpc.posts.createComment.useMutation({
    onSuccess: (data, { postId }) => {
      utils.posts.comments.setData({ postId }, (old) =>
        old
          ? produce(old, (draft) => {
              draft.unshift(data);
            })
          : [data]
      );

      utils.posts.byId.setData(
        { postId },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.commentsAmount += 1;
          })
      );
    },
  });
};
