import React, { ReactNode, useState } from 'react';
import { trpc } from '../utils/trpc';
import { useSession } from 'next-auth/react';
import { ProfileIcon, FeedButton, UserHoverCard, Button } from '@components';
import { useFollow, useUnfollow } from '@hooks';
import {
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

interface SeeUserFollowProps {
  userId: string;
  children: ReactNode;
  defaultTab: 'following' | 'followers';
}

export function SeeUserFollow({ userId, children, defaultTab }: SeeUserFollowProps) {
  const [tab, setTab] = useState<typeof defaultTab>(defaultTab);
  const { data: session } = useSession();
  const { data: following } = trpc.user.followingUsers.useQuery({ userId });
  const { data: followers } = trpc.user.followerUsers.useQuery({ userId });
  const follow = useFollow();
  const unfollow = useUnfollow();

  return (
    <Modal onOpenChange={() => setTab(defaultTab)}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent css={{ p: 0 }}>
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(value) => setTab(value as typeof defaultTab)}
        >
          <TabsList asChild>
            <Flex justify={'center'} gap={'4'} css={{ borderBottom: '1px solid $bg-1' }}>
              <TabsTrigger value="followers" asChild>
                <FeedButton theme={'light'} active={tab === 'followers'}>
                  Seguidores
                </FeedButton>
              </TabsTrigger>
              <TabsTrigger value="following" asChild>
                <FeedButton theme={'light'} active={tab === 'following'}>
                  Seguindo
                </FeedButton>
              </TabsTrigger>
            </Flex>
          </TabsList>
          {[followers, following].map((tab, index) => (
            <TabsContent
              value={index === 0 ? 'followers' : 'following'}
              key={index}
              css={{ ...(tab && tab.length > 7 && { overflowY: 'scroll' }) }}
            >
              {tab &&
                tab.map((user, index) => (
                  <Flex
                    css={{ px: '$3', pt: '$2' }}
                    key={index}
                    justify={'between'}
                    align={'center'}
                  >
                    <UserHoverCard user={user}>
                      <Flex align={'center'} gap={'2'}>
                        <ProfileIcon css={{ size: '$8' }} src={user.image} alt="" />
                        <Text weight={600} color={'black-primary'}>
                          {user.name}
                        </Text>
                      </Flex>
                    </UserHoverCard>
                    {session && user.id !== session?.user.id && (
                      <Button
                        css={{ p: '$2', height: '20px' }}
                        onClick={() =>
                          user.isFollowing
                            ? unfollow.mutate({ followingUser: user })
                            : follow.mutate({ followingUser: user })
                        }
                      >
                        {user.isFollowing ? 'Seguindo' : 'Seguir'}
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
