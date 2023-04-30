import { useSession } from 'next-auth/react';
import { produce } from 'immer';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { manyFriendshipStatus } from 'src/@types/types';
import { trpc } from '@utils';

export const useUnfollow = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.user.unfollow.useMutation({
    onMutate: ({ followingUser }) => {
      if (!session) {
        return;
      }

      const queries = queryClient.getQueriesData(
        getQueryKey(trpc.user.manyFriendshipStatus)
      );

      queries.forEach((query) =>
        queryClient.setQueriesData<manyFriendshipStatus>(
          query[0],
          (old) =>
            old &&
            produce(old, (draft) => {
              if (draft[followingUser.id]) {
                draft[followingUser.id].following = false;
              }
            })
        )
      );

      utils.user.friendshipStatus.setData(
        { username: followingUser.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.following = false;
          })
      );

      utils.user.friendshipCount.setData(
        { username: followingUser.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followersAmount -= 1;
          })
      );

      utils.user.friendshipCount.setData(
        { username: session.user.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followingAmount -= 1;
          })
      );
    },
  });
};
