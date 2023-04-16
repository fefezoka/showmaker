import { useSession } from 'next-auth/react';
import { produce } from 'immer';
import { trpc } from '../utils/trpc';

export const useFollow = () => {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  return trpc.user.follow.useMutation({
    onMutate: ({ followingUser }) => {
      if (!session) {
        return;
      }

      utils.user.profile.setData(
        { name: followingUser.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followersAmount += 1;
            draft.isFollowing = true;
          })
      );

      utils.user.profile.setData(
        { name: session.user.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followingAmount += 1;
            draft.isFollowing = true;
          })
      );

      utils.user.followerUsers.setData(
        { userId: session.user.id },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.forEach((user) => {
              if (user.id === followingUser.id) {
                user.isFollowing = true;
                user.followingAmount += 1;
              }
            });
          })
      );

      utils.user.followingUsers.setData(
        { userId: session.user.id },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.forEach((user) => {
              if (user.id === followingUser.id) {
                user.isFollowing = true;
                user.followersAmount += 1;
              }
            });
          })
      );
    },
  });
};
