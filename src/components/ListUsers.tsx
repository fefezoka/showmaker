import { Box, Button, Flex, ProfileIcon, Text } from '@styles';
import React from 'react';
import { UserHoverCard } from './UserHoverCard';
import { User } from '@types';
import { trpc } from '@utils';
import { useSession } from 'next-auth/react';
import { useFollow, useUnfollow } from '@hooks';

interface IListUsers {
  users: User[];
  transparent?: boolean;
  showIfUserFollowYou?: boolean;
}

export const ListUsers = ({
  users,
  transparent = true,
  showIfUserFollowYou = true,
}: IListUsers) => {
  const { data: session } = useSession();
  const follow = useFollow();
  const unfollow = useUnfollow();

  const { data: friendshipStatuses } = trpc.user.manyFriendshipStatus.useQuery(
    { users },
    { enabled: !!(users && users.length !== 0) }
  );

  return (
    <>
      {friendshipStatuses &&
        users?.map((user) => (
          <Flex
            css={{ px: '$3', mt: '$2', ...(!transparent && { bc: '$bg2', br: '$2' }) }}
            key={user.id}
            justify={'between'}
            align={'center'}
          >
            <Box>
              <UserHoverCard user={user}>
                <Flex align={'center'} gap={'3'}>
                  <ProfileIcon css={{ size: '44px' }} src={user.image} alt="" />
                  <Text weight={600} size={'5'}>
                    {user.name}
                  </Text>
                  {showIfUserFollowYou && friendshipStatuses[user.id].followed_by && (
                    <Text size={'1'} color={'gray'}>
                      Segue você
                    </Text>
                  )}
                </Flex>
              </UserHoverCard>
            </Box>
            {user.id !== session?.user.id && (
              <Button
                size={'1'}
                css={{ p: '$2', fontSize: '$2' }}
                onClick={() =>
                  friendshipStatuses[user.id].following
                    ? unfollow.mutate({ followingUser: user })
                    : follow.mutate({ followingUser: user })
                }
                disabled={follow.isLoading || unfollow.isLoading}
              >
                {friendshipStatuses[user.id].following ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </Flex>
        ))}
    </>
  );
};
