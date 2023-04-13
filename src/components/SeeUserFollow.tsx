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
            <Flex justify={'center'} gap={'4'} css={{ borderBottom: '1px solid $bg' }}>
              <TabsTrigger value="followers" asChild>
                <FeedButton
                  theme={'light'}
                  value="Seguidores"
                  active={tab === 'followers'}
                />
              </TabsTrigger>
              <TabsTrigger value="following" asChild>
                <FeedButton
                  theme={'light'}
                  value="Seguindo"
                  active={tab === 'following'}
                />
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
                        <Text weight={'bold'}>{user.name}</Text>
                      </Flex>
                    </UserHoverCard>
                    {user.id !== session?.user.id && (
                      <Button
                        css={{ p: '$2', height: '20px' }}
                        value={user.isFollowing ? 'Seguindo' : 'Seguir'}
                        onClick={() =>
                          user.isFollowing
                            ? unfollow.mutate({ followingUser: user })
                            : follow.mutate({ followingUser: user })
                        }
                      />
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
