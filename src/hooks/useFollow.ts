import { useSession } from 'next-auth/react';
import { produce } from 'immer';
import { trpc } from '../utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { manyFriendshipStatus } from 'src/@types/types';

export const useFollow = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  return trpc.user.follow.useMutation({
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
                draft[followingUser.id].following = true;
              }
            })
        )
      );

      utils.user.friendshipStatus.setData(
        { username: followingUser.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.following = true;
          })
      );

      utils.user.friendshipCount.setData(
        { username: followingUser.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followersAmount += 1;
          })
      );

      utils.user.friendshipCount.setData(
        { username: session.user.name },
        (old) =>
          old &&
          produce(old, (draft) => {
            draft.followingAmount += 1;
          })
      );
    },
  });
};
