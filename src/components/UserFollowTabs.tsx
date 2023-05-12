import React, { ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '@utils';
import { UserHoverCard } from '@components';
import { useFollow, useUnfollow } from '@hooks';
import {
  Button,
  ProfileIcon,
  Modal,
  ModalContent,
  ModalTrigger,
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
  Flex,
  Text,
  Box,
} from '@styles';

interface IUserFollowTabs {
  userId: string;
  children: ReactNode;
  defaultTab: 'following' | 'followers';
}

export function UserFollowTabs({ userId, children, defaultTab }: IUserFollowTabs) {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<typeof defaultTab>(defaultTab);
  const { data: session } = useSession();
  const follow = useFollow();
  const unfollow = useUnfollow();

  const following = trpc.user.following.useQuery({ userId }, { enabled: open });
  const followers = trpc.user.followers.useQuery({ userId }, { enabled: open });
  const friendshipStatuses = [
    trpc.user.manyFriendshipStatus.useQuery(
      { users: followers.data },
      { enabled: !!followers.data }
    ),
    trpc.user.manyFriendshipStatus.useQuery(
      { users: following.data },
      { enabled: !!following.data }
    ),
  ];

  return (
    <Modal
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setTab(defaultTab);
      }}
    >
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent css={{ p: 0 }} closeButton={false}>
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(value) => setTab(value as typeof defaultTab)}
        >
          <TabsList asChild>
            <Flex justify={'center'} css={{ borderBottom: '2px solid $bg2' }}>
              <TabsTrigger value="followers" asChild>
                <Button ghost active={tab === 'followers'}>
                  Seguidores
                </Button>
              </TabsTrigger>
              <TabsTrigger value="following" asChild>
                <Button ghost active={tab === 'following'}>
                  Seguindo
                </Button>
              </TabsTrigger>
            </Flex>
          </TabsList>
          {[followers.data, following.data].map((tab, tabIndex) => (
            <TabsContent
              value={tabIndex === 0 ? 'followers' : 'following'}
              key={tabIndex}
            >
              {!(
                followers.isLoading ||
                following.isLoading ||
                friendshipStatuses.some((status) => status.isLoading)
              ) &&
                tab &&
                tab.map((user, userIndex) => (
                  <Flex
                    css={{ px: '$3', pt: '$2' }}
                    key={userIndex}
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
                          {tabIndex === 1 &&
                            friendshipStatuses[tabIndex].data?.[user.id].followed_by && (
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
                          friendshipStatuses[tabIndex].data?.[user.id].following
                            ? unfollow.mutate({ followingUser: user })
                            : follow.mutate({ followingUser: user })
                        }
                        disabled={follow.isLoading || unfollow.isLoading}
                      >
                        {friendshipStatuses[tabIndex].data?.[user.id].following
                          ? 'Seguindo'
                          : 'Seguir'}
                      </Button>
                    )}
                  </Flex>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </ModalContent>
    </Modal>
  );
}
