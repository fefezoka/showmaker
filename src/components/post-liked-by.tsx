import { ListUsers } from '@/components/list-users';
import { Box } from '@/styles/box';
import { Heading } from '@/styles/heading';
import { Modal, ModalContent, ModalTrigger } from '@/styles/modal';
import { trpc } from '@/utils/trpc';
import React, { ReactNode, useState } from 'react';

interface IPostLikedByUsers {
  children: ReactNode;
  postId: string;
}

export const PostLikedByUsers = ({ children, postId }: IPostLikedByUsers) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: users } = trpc.posts.likedBy.useQuery({ postId }, { enabled: open });

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
        {users && <ListUsers users={users} />}
      </ModalContent>
    </Modal>
  );
};
