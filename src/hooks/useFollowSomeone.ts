import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';

export const useFollowSomeone = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation(
    async (user: User) => {
      await axios.post(`/api/user/${user.isFollowing ? 'unfollow' : 'follow'}`, {
        followerId: session?.user.id,
        followingId: user.id,
      });
    },
    {
      onMutate: (user) => {
        queryClient.setQueryData<User>(
          ['user', user.name],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.isFollowing
                ? (draft.followersAmount -= 1)
                : (draft.followersAmount += 1);
              draft.isFollowing = !draft.isFollowing;
            })
        );

        queryClient.setQueryData<User>(
          ['user', session?.user.name],
          (old) =>
            old &&
            produce(old, (draft) => {
              draft.isFollowing
                ? (draft.followingAmount -= 1)
                : (draft.followingAmount += 1);
            })
        );
      },
    }
  );
};
