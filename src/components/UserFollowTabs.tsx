import React, { ReactNode, useState } from 'react';
import { trpc } from '@utils';
import { ListUsers } from '@components';
import {
  Button,
  Modal,
  ModalContent,
  ModalTrigger,
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
  Flex,
} from '@styles';

interface IUserFollowTabs {
  userId: string;
  children: ReactNode;
  defaultTab: 'following' | 'followers';
}

export function UserFollowTabs({ userId, children, defaultTab }: IUserFollowTabs) {
  const [open, setOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<typeof defaultTab>(defaultTab);

  const following = trpc.user.following.useQuery({ userId }, { enabled: open });
  const followers = trpc.user.followers.useQuery({ userId }, { enabled: open });

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
              {!(followers.isLoading || following.isLoading) && tab && (
                <ListUsers users={tab} showIfUserFollowYou={tabIndex === 1} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ModalContent>
    </Modal>
  );
}
