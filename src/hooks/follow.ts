import { signIn, useSession } from 'next-auth/react';
import { produce } from 'immer';
import { trpc } from '@/utils/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { ManyFriendshipStatus } from '@/types/types';
import { ReactQueryOptions, RouterInputs } from '@/server/trpc';

type FollowInputs = RouterInputs['user']['follow'];
type FollowConfig = ReactQueryOptions['user']['follow'];

export const useFollow = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const follow = trpc.user.follow.useMutation({
    onMutate: ({ followingUser }) => {
      if (!session) {
        return;
      }

      const queries = queryClient.getQueriesData({
        queryKey: getQueryKey(trpc.user.manyFriendshipStatus),
      });

      queries.forEach((query) =>
        queryClient.setQueriesData<ManyFriendshipStatus>(
          { queryKey: query[0] },
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

  const mutateAsync = async (input: FollowInputs, config?: FollowConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return await follow.mutateAsync({ ...input }, { ...config });
  };

  const mutate = (input: FollowInputs, config?: FollowConfig) => {
    if (!session) {
      signIn('discord');
      return;
    }
    return follow.mutate({ ...input }, { ...config });
  };

  return {
    ...follow,
    mutate,
    mutateAsync,
  };
};

export const useUnfollow = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  return trpc.user.unfollow.useMutation({
    onMutate: ({ followingUser }) => {
      if (!session) {
        return;
      }

      const queries = queryClient.getQueriesData({
        queryKey: getQueryKey(trpc.user.manyFriendshipStatus),
      });

      queries.forEach((query) =>
        queryClient.setQueriesData<ManyFriendshipStatus>(
          { queryKey: query[0] },
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
