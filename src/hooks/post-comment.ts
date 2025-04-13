import { produce } from 'immer';
import { trpc } from '@/utils/trpc';

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
    },
  });
};

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
