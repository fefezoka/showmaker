import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalTrigger,
  ProfileIcon,
  Text,
} from '@styles';
import { trpc } from '@utils';
import React, { ReactNode, useState } from 'react';
import { UserHoverCard } from './UserHoverCard';
import { useSession } from 'next-auth/react';
import { useFollow, useUnfollow } from '@hooks';

interface IPostLikedByUsers {
  children: ReactNode;
  postId: string;
}

export const PostLikedByUsers = ({ children, postId }: IPostLikedByUsers) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const follow = useFollow();
  const unfollow = useUnfollow();

  const { data: users } = trpc.posts.likedBy.useQuery({ postId }, { enabled: open });
  const { data: friendshipStatuses } = trpc.user.manyFriendshipStatus.useQuery(
    { users },
    { enabled: !!(users && users.length !== 0) }
  );

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent css={{ p: 0, height: 440 }}>
        <Box
          css={{
            py: '$2',
            mb: '$2',
            position: 'sticky',
            top: 0,
            borderBottom: '2px solid $bg2',
          }}
        >
          <Box css={{ ml: '$3' }}>
            <Heading size="2">Curtido por</Heading>
          </Box>
        </Box>
        {friendshipStatuses &&
          users?.map((user) => (
            <Flex
              css={{ px: '$3', pt: '$2' }}
              key={user.id}
              justify={'between'}
              align={'center'}
            >
              <Box onClick={() => setOpen(false)}>
                <UserHoverCard user={user}>
                  <Flex align={'center'} gap={'2'}>
                    <ProfileIcon css={{ size: '44px' }} src={user.image} alt="" />
                    <Text weight={600} size={'5'}>
                      {user.name}
                    </Text>
                    {friendshipStatuses[user.id].followed_by && (
                      <Text size={'1'} color={'gray'}>
                        Segue você
                      </Text>
                    )}
                  </Flex>
                </UserHoverCard>
              </Box>
              {user.id !== session?.user.id && (
                <Button
                  css={{ p: '$2', height: '36px', fontSize: '$2' }}
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
      </ModalContent>
    </Modal>
  );
};
