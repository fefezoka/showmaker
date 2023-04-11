import { produce } from 'immer';
import { trpc } from '../utils/trpc';

export const useCreatePost = () => {
  const utils = trpc.useContext();

  return trpc.posts.create.useMutation({
    onSuccess: (data, { game }) => {
      utils.posts.infinitePosts.feed.setInfiniteData(
        {},
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(data);
          })
      );

      utils.posts.infinitePosts.user.profile.setInfiniteData(
        { name: data.user.name, feed: 'posts' },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.pages[0].posts.unshift(data);
          })
      );

      utils.posts.byId.setData({ postId: data.id }, data);
    },
  });
};
