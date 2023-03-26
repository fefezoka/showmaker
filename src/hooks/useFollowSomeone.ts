import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from 'react-query';

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
        queryClient.setQueryData<User | undefined>(
          ['user', user.name],
          (old) =>
            old && {
              ...old,
              followersAmount: old.isFollowing
                ? old.followersAmount - 1
                : old.followersAmount + 1,
              isFollowing: !old.isFollowing,
            }
        );

        queryClient.setQueryData<User | undefined>(
          ['user', session?.user.name],
          (old) =>
            old && {
              ...old,
              followingAmount: user.isFollowing
                ? old.followingAmount - 1
                : old.followingAmount + 1,
            }
        );
      },
    }
  );
};
