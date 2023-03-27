import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { Button, Select } from './';
import { signIn, useSession } from 'next-auth/react';
import { IoAdd } from 'react-icons/io5';
import { useIsDesktop, useCreatePost } from '../hooks';
import { getVideoFrame } from '../utils/getVideoFrame';
import {
  Box,
  Flex,
  Text,
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalTrigger,
} from '../styles';
import { styled } from '../../stitches.config';

const DropContainer = styled('section', {
  width: '100%',
  height: '120px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px dashed $input-gray',
  margin: '$3 0',
  borderRadius: '$2',
  padding: '$3',
  cursor: 'pointer',

  variants: {
    active: {
      true: {
        borderColor: '$blue',
      },
    },
  },
});

export default function CreatePost() {
  const titleRef = useRef<HTMLInputElement>(null);
  const gameSelectRef = useRef<React.ElementRef<typeof Select>>(null);
  const { data: session } = useSession();
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const createPost = useCreatePost();
  const isDesktop = useIsDesktop();

  const onClose = () => {
    setOpen(false);
    setFile(undefined);
    setThumbnail(undefined);
  };

  const processFile = async () => {
    const game = gameSelectRef.current?.getValue() as { value: string; label: string }[];

    if (
      createPost.isLoading ||
      !file ||
      !thumbnail ||
      !titleRef.current?.value ||
      !game
    ) {
      return;
    }

    await createPost.mutateAsync({
      file,
      game: game[0].value,
      thumbnail,
      title: titleRef.current?.value,
    });

    onClose();
  };

  return (
    <Modal open={session && open ? true : false} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        {isDesktop ? (
          <Button onClick={() => !session && signIn('discord')} value="Postar vídeo" />
        ) : (
          <Button
            Icon={IoAdd}
            radius="full"
            onClick={() => !session && signIn('discord')}
          />
        )}
      </ModalTrigger>
      <ModalContent
        onInteractOutside={(e: Event) =>
          createPost.isLoading ? e.preventDefault() : onClose()
        }
      >
        <ModalTitle>Postar vídeo</ModalTitle>
        <ModalDescription>
          Compartilhe suas jogadas favoritas com a comunidade!
        </ModalDescription>
        <Box css={{ mt: '$6' }}>
          <Text as={'label'} htmlFor="name">
            Título
          </Text>
          <Box
            as={'input'}
            ref={titleRef}
            css={{
              backgroundColor: 'white',
              padding: '$3',
              borderRadius: '$1',
              width: '100%',
              border: '1px solid $input-gray',
              margin: '$1 0px',
              transition: '100ms all',
              '&:focus': {
                border: '1px solid #2684ff',
                boxShadow: '0 0 0 1px #2684ff',
              },
            }}
          />

          <Box css={{ mt: '$1' }}>
            <Text as={'label'}>Jogo</Text>
            <Box css={{ margin: '$1 0px' }}>
              <Select
                ref={gameSelectRef}
                placeholder={'Selecione um jogo'}
                options={[
                  { label: 'Valorant', value: 'valorant' },
                  { label: 'FIFA', value: 'fifa' },
                  { label: 'CS:GO', value: 'csgo' },
                  { label: 'LOL', value: 'lol' },
                  { label: 'Rainbow Six Siege', value: 'r6' },
                  { label: 'Outro', value: 'other' },
                ]}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Dropzone
            accept={{ 'video/mp4': [] }}
            onDropAccepted={async (files) => {
              setFile(files[0]);
              setThumbnail(await getVideoFrame(files[0]));
            }}
            onDropRejected={() => {
              setFile(undefined);
              setThumbnail(undefined);
            }}
            maxSize={104857600}
          >
            {({ getRootProps, fileRejections, isDragActive, acceptedFiles }) => (
              <Box as={'section'}>
                <DropContainer
                  {...getRootProps()}
                  active={isDragActive || acceptedFiles.length !== 0}
                >
                  {fileRejections.length !== 0 && <Text>Arquivo muito grande</Text>}
                  {file ? (
                    <Flex gap={'4'}>
                      {thumbnail && (
                        <Image src={thumbnail} alt="" width={160} height={90} />
                      )}
                      <Text as={'p'} css={{ lineBreak: 'anywhere' }}>
                        {file.name} - {(file.size / 1048576).toFixed(2)} MB{' '}
                      </Text>
                    </Flex>
                  ) : (
                    <Flex direction={'column'} align={'center'} gap={'1'}>
                      <Text>Arraste um vídeo ou clique para procurar</Text>
                      <Text>Limite de 100MB</Text>
                    </Flex>
                  )}
                </DropContainer>
              </Box>
            )}
          </Dropzone>
        </Box>
        <Flex justify={'between'} align={'center'} css={{ mt: '$6' }}>
          <ModalClose asChild>
            <Button
              disabled={createPost.isLoading}
              onClick={onClose}
              variant={'exit'}
              value="Sair"
            />
          </ModalClose>
          <Button
            loading={createPost.isLoading}
            disabled={!file}
            onClick={processFile}
            value="Enviar"
          />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
