import { useEditPostComment } from '@hooks';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
  Text,
} from '@styles';
import { PostComment } from '@types';
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
