import { UserHoverCard } from '@/components/user-hover-card';
import { useFollow, useUnfollow } from '@/hooks/follow';
import { Box } from '@/styles/box';
import { Button } from '@/styles/button';
import { Flex } from '@/styles/flex';
import { ProfileIcon } from '@/styles/profile-icon';
import { Text } from '@/styles/text';
import { User } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import React from 'react';

interface IListUsers {
  users: User[];
  transparent?: boolean;
  showIfUserFollowYou?: boolean;
  onClickOnUser?: () => void;
}

export const ListUsers = ({
  users,
  transparent = true,
  showIfUserFollowYou = true,
  onClickOnUser,
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
            css={{
              px: '$3',
              py: '$1',
              transition: 'all 100ms',
              '&:hover': { bc: '$bg2' },
              ...(!transparent && { bc: '$bg2', br: '$2' }),
            }}
            key={user.id}
            justify={'between'}
            align={'center'}
          >
            <Box>
              <UserHoverCard onClickOnUser={onClickOnUser} user={user}>
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
                css={{ fontSize: '$2' }}
                onClick={() =>
                  friendshipStatuses[user.id].following
                    ? unfollow.mutate({ followingUser: user })
                    : follow.mutate({ followingUser: user })
                }
                disabled={follow.isPending || unfollow.isPending}
              >
                {friendshipStatuses[user.id].following ? 'Seguindo' : 'Seguir'}
              </Button>
            )}
          </Flex>
        ))}
    </>
  );
};
