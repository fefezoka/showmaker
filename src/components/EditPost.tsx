import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control, FieldValues } from 'react-hook-form';
import { z } from 'zod';
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
  Select,
  Text,
} from '@styles';
import { Post } from '@types';
import { useEditPost } from '@hooks';
import { gameOptions } from '@components';

const editPostSchema = z
  .object({
    title: z.string(),
    game: z
      .object({ value: z.string(), label: z.string() })
      .transform((game) => game.value),
  })
  .partial()
  .superRefine((data, ctx) => {
    if (!data.game && !data.title) {
      ctx.addIssue({
        code: 'too_small',
        message: 'Preencha ao menos um campo',
        type: 'string',
        inclusive: true,
        minimum: 1,
        path: ['title'],
      });
    }
  });

type EditPostData = z.infer<typeof editPostSchema>;

export const EditPost = ({
  post,
  children,
  ...props
}: React.ComponentProps<typeof ModalContent> & {
  post: Post;
}) => {
  const [open, setOpen] = useState<boolean>();
  const editPost = useEditPost();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPostData>({
    resolver: zodResolver(editPostSchema),
  });

  const handleEdit = (data: EditPostData) => {
    editPost.mutate({ postId: post.id, title: data.title, game: data.game });
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent {...props}>
        <Box as={'form'} onSubmit={handleSubmit(handleEdit)}>
          <Box css={{ mb: '$6' }}>
            <ModalTitle>Editar postagem</ModalTitle>
          </Box>
          <Flex justify={'between'}>
            <Text as={'label'}>Título</Text>
            {errors.title && (
              <Text color={'red-primary'} weight={600}>
                {errors.title.message}
              </Text>
            )}
          </Flex>
          <Input
            {...register('title')}
            placeholder={post.title}
            css={{ px: '$3', my: '$1' }}
          />

          <Box css={{ mt: '$1' }}>
            <Flex justify={'between'}>
              <Text as={'label'}>Jogo</Text>
              {errors.title && (
                <Text color={'red-primary'} weight={600}>
                  {errors.title.message}
                </Text>
              )}
            </Flex>
            <Box css={{ my: '$1' }}>
              <Select
                control={control as unknown as Control<FieldValues>}
                name="game"
                placeholder={
                  gameOptions.find((option) => option.value === post.game)?.label
                }
                options={gameOptions}
              />
            </Box>
          </Box>

          <Flex justify={'between'} css={{ mt: '$6' }}>
            <ModalClose>
              <Button variant={'red'}>Sair</Button>
            </ModalClose>
            <Button type="submit">Enviar</Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
