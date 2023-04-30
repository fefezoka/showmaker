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
  const friendship_statuses = [
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
      onOpenChange={(e) => {
        setOpen(e);
        setTab(defaultTab);
      }}
    >
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent css={{ p: 0 }}>
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(value) => setTab(value as typeof defaultTab)}
        >
          <TabsList asChild>
            <Flex justify={'center'} css={{ borderBottom: '2px solid $bg-2' }}>
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
                friendship_statuses.some((status) => status.isLoading)
              ) &&
                tab &&
                tab.map((user, userIndex) => (
                  <Flex
                    css={{ px: '$3', pt: '$2' }}
                    key={userIndex}
                    justify={'between'}
                    align={'center'}
                  >
                    <UserHoverCard user={user}>
                      <Flex align={'center'} gap={'2'}>
                        <ProfileIcon css={{ size: '44px' }} src={user.image} alt="" />
                        <Text weight={600} color={'primary'} size={'5'}>
                          {user.name}
                        </Text>
                        {tabIndex === 1 &&
                          friendship_statuses[tabIndex].data?.[user.id].followed_by && (
                            <Text size={'1'} color={'secondary'}>
                              Segue você
                            </Text>
                          )}
                      </Flex>
                    </UserHoverCard>
                    {session &&
                      user.id !== session.user.id &&
                      friendship_statuses[tabIndex].data?.[user.id] && (
                        <Button
                          css={{ p: '$2', height: '36px', fontSize: '$2' }}
                          onClick={() =>
                            friendship_statuses[tabIndex].data?.[user.id].following
                              ? unfollow.mutate({ followingUser: user })
                              : follow.mutate({ followingUser: user })
                          }
                          disabled={follow.isLoading || unfollow.isLoading}
                        >
                          {friendship_statuses[tabIndex].data?.[user.id].following
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
