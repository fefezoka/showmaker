import { useEditPostComment } from '@/hooks/post-comment';
import { Box } from '@/styles/box';
import { Button } from '@/styles/button';
import { Flex } from '@/styles/flex';
import { Input } from '@/styles/input';
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from '@/styles/modal';
import { Text } from '@/styles/text';
import { toast } from '@/styles/toast';
import { PostComment } from '@/types/types';
import React, { FormEvent, useState } from 'react';

interface IEditComment extends React.ComponentProps<typeof Modal> {
  comment: PostComment;
  postId: string;
}

export const EditComment = ({ comment, postId, children }: IEditComment) => {
  const [open, setOpen] = useState<boolean>(false);
  const editComment = useEditPostComment();

  const handleEdit = (e: FormEvent<HTMLFormElement>, commentId: string) => {
    e.preventDefault();
    setOpen(false);
    const message = (e.currentTarget[0] as HTMLInputElement).value;

    if (!message) {
      return;
    }

    editComment.mutate({ postId: postId, message, commentId });
    toast.success('Comentário editado com sucesso!');
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <Box as={'form'} onSubmit={(e) => handleEdit(e, comment.id)}>
          <Box css={{ mb: '$4' }}>
            <ModalTitle>Editar comentário</ModalTitle>
          </Box>
          <Text>Mensagem</Text>
          <Input placeholder={comment.message} css={{ mt: '$1' }} />
          <Flex justify={'between'} css={{ mt: '$6' }}>
            <ModalClose asChild>
              <Button variant={'red'}>Sair</Button>
            </ModalClose>
            <Button type="submit">Enviar</Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
