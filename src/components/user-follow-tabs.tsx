import { ListUsers } from '@/components/list-users';
import { Button } from '@/styles/button';
import { Flex } from '@/styles/flex';
import { Modal, ModalContent, ModalTrigger } from '@/styles/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/styles/tabs';
import { trpc } from '@/utils/trpc';
import React, { ReactNode, useState } from 'react';

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
      <ModalContent css={{ p: 0 }}>
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(value) => setTab(value as typeof defaultTab)}
        >
          <TabsList asChild>
            <Flex justify={'center'} css={{ borderBottom: '1px solid $bg4' }}>
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
          {[followers.data, following.data].map((users, index) => (
            <TabsContent value={index === 0 ? 'followers' : 'following'} key={index}>
              {!(followers.isLoading || following.isLoading) && users && (
                <ListUsers
                  users={users}
                  onClickOnUser={() => setOpen(false)}
                  showIfUserFollowYou={index === 1}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </ModalContent>
    </Modal>
  );
}
