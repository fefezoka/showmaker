import React, { useState } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { z } from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { Controller, useForm, Control, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePost } from '@/hooks/post';
import { Box } from '@/styles/box';
import { Button } from '@/styles/button';
import { Flex } from '@/styles/flex';
import { Heading } from '@/styles/heading';
import { Input } from '@/styles/input';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from '@/styles/modal';
import { Select } from '@/styles/select';
import { Text } from '@/styles/text';
import { getVideoThumbnail } from '@/utils/get-video-thumbnail';

export const gameOptions = [
  { label: 'Valorant', value: 'valorant' },
  { label: 'FIFA', value: 'fifa' },
  { label: 'CS:GO', value: 'csgo' },
  { label: 'LOL', value: 'lol' },
  { label: 'Rainbow Six', value: 'r6' },
  { label: 'Outros', value: 'other' },
] as const;

const createPostSchema = z.object({
  file: z.object(
    {
      video: typeof window === 'undefined' ? z.any() : z.instanceof(File),
      thumbnail: z.string(),
    },
    { required_error: 'Selecione um vídeo' }
  ),
  title: z.string(),
  game: z.object(
    { value: z.string(), label: z.string() },
    { required_error: 'O jogo é obrigatório' }
  ),
});

type CreatePostData = z.infer<typeof createPostSchema>;

export const CreatePost = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const createPost = useCreatePost();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
  });

  const handleCreatePost = async (data: CreatePostData) => {
    await createPost.mutateAsync({ ...data, game: data.game.value });
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        if (open && !session) {
          return signIn('discord');
        }

        setOpen(open);
        reset();
      }}
    >
      <ModalTrigger asChild>
        <Button
          css={{
            width: '100%',
            br: '$pill',
            height: 48,
            fontSize: '$4',
            fontWeight: 600,
          }}
        >
          Postar vídeo
        </Button>
      </ModalTrigger>
      <ModalContent
        onInteractOutside={(e) =>
          createPost.isLoading ? e.preventDefault() : setOpen(false)
        }
      >
        <Box as={'form'} onSubmit={handleSubmit(handleCreatePost)}>
          <ModalTitle asChild>
            <Heading size="3" css={{ lh: 'unset' }}>
              Postar vídeo
            </Heading>
          </ModalTitle>
          <ModalDescription asChild>
            <Text color={'gray'} size={'4'}>
              Compartilhe suas jogadas favoritas com a comunidade!
            </Text>
          </ModalDescription>
          <Box css={{ mt: '$5' }}>
            <Flex>
              <Text as={'label'}>Título</Text>
            </Flex>
            <Input
              {...register('title')}
              placeholder="Escreva um título - Opcional"
              css={{ px: '$3', my: '$1' }}
            />

            <Box css={{ mt: '$1' }}>
              <Flex justify={'between'}>
                <Text as={'label'}>Jogo</Text>
                {errors.game && (
                  <Text color={'red'} weight={600}>
                    {errors.game.message}
                  </Text>
                )}
              </Flex>

              <Box css={{ my: '$1' }}>
                <Select
                  control={control as unknown as Control<FieldValues>}
                  name="game"
                  placeholder={'Selecione um jogo'}
                  options={gameOptions}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Dropzone
                  accept={{ 'video/mp4': [] }}
                  onDropAccepted={async (files) => {
                    field.onChange({
                      video: files[0],
                      thumbnail: await getVideoThumbnail(files[0]),
                    });
                  }}
                  onDropRejected={() => {
                    field.onChange(null);
                  }}
                  maxSize={104857600}
                >
                  {({ getRootProps, fileRejections, isDragActive, acceptedFiles }) => (
                    <Flex
                      justify={'center'}
                      direction={'column'}
                      align={'center'}
                      css={{
                        width: '100%',
                        height: '120px',
                        border: '2px dashed $bg4',
                        bc: '$bg2',
                        mt: '$4',
                        br: '$2',
                        p: '$3',
                        cursor: 'pointer',
                        ...((isDragActive || acceptedFiles.length !== 0) && {
                          borderColor: '$blue9',
                        }),
                      }}
                      {...getRootProps()}
                    >
                      {field.value ? (
                        <Flex gap={'3'} justify={'between'} css={{ width: '100%' }}>
                          <Box
                            as={Image}
                            src={field.value.thumbnail}
                            alt=""
                            width={110}
                            height={90}
                            css={{ objectFit: 'cover' }}
                          />
                          <Flex
                            direction={'column'}
                            justify={'between'}
                            css={{ width: '100%' }}
                          >
                            <Text as={'p'} weight={600} css={{ lineBreak: 'anywhere' }}>
                              {field.value.video.name}
                            </Text>
                            <Box>
                              <Text size={'2'}>
                                {(
                                  (field.value.video.size / 1048576) *
                                  createPost.progress
                                ).toFixed(0)}{' '}
                                MB / {(field.value.video.size / 1048576).toFixed(0)} MB
                              </Text>
                              <Flex align={'center'} gap={'2'} css={{ mt: '2px' }}>
                                <Box
                                  css={{
                                    height: '$2',
                                    width: '100%',
                                    bc: '$bg2',
                                    br: '$1',
                                    position: 'relative',
                                    border: '1px solid $bg3',
                                  }}
                                >
                                  <Box
                                    css={{
                                      width: (createPost.progress * 100).toFixed(0) + '%',
                                      height: '100%',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      bc: '$blue9',
                                      br: '$1',
                                    }}
                                  />
                                </Box>
                                <Text size={'2'}>
                                  {(createPost.progress * 100).toFixed(0)}%
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                        </Flex>
                      ) : (
                        <Flex direction={'column'} align={'center'} gap={'1'}>
                          {fileRejections.length !== 0 && (
                            <Text weight={600}>Arquivo muito grande</Text>
                          )}
                          {errors.file && (
                            <Text weight={600} color={'red'}>
                              {errors.file.message}
                            </Text>
                          )}
                          <Text color={'gray'}>
                            Arraste um vídeo ou clique para procurar
                          </Text>
                          <Text color={'gray'}>Limite de 100 MB</Text>
                        </Flex>
                      )}
                    </Flex>
                  )}
                </Dropzone>
              )}
            />
          </Box>
          <Flex justify={'between'} align={'center'} css={{ mt: '$4' }}>
            <ModalClose asChild>
              <Button disabled={createPost.isLoading} variant={'red'}>
                Sair
              </Button>
            </ModalClose>
            <Button type="submit" loading={createPost.isLoading}>
              Enviar
            </Button>
          </Flex>
        </Box>
      </ModalContent>
    </Modal>
  );
};
