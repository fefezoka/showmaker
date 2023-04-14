import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { signIn, useSession } from 'next-auth/react';
import { styled } from '../../stitches.config';
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';
import { getVideoFrame } from '../utils/getVideoFrame';
import { useIsDesktop, useCreatePost } from '@hooks';
import { Button, Select } from '@components';
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
} from '@styles';

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
  const [isSendingVideo, setIsSendingVideo] = useState<boolean>(false);
  const isDesktop = useIsDesktop();

  const onClose = () => {
    setIsSendingVideo(false);
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
    setIsSendingVideo(true);
    const XUniqueUploadId = +new Date();

    const processThumbnail = async () => {
      const formdata = new FormData();
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('file', thumbnail);
      formdata.append('upload_preset', 'gjfsvh53');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formdata,
        {
          headers: {
            'X-Unique-Upload-Id': `${XUniqueUploadId}`,
          },
        }
      );
      return data;
    };

    const processVideo = async () => {
      const size = file.size;
      const sliceSize = 15000000;
      var start = 0;

      const loop: any = async () => {
        var end = start + sliceSize;

        if (end > size) {
          end = size;
        }

        const piece = file.slice.bind(file)(start, end) as File;
        const videoData = await sendVideoPiece(piece, start, end - 1, size);
        if (end < size) {
          start += sliceSize;
          return loop();
        }
        return videoData;
      };
      return await loop();
    };

    const sendVideoPiece = async (
      piece: File,
      start: number,
      end: number,
      size: number
    ) => {
      const formdata = new FormData();
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('file', piece);
      formdata.append('upload_preset', 'tamnuopz');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formdata,
        {
          headers: {
            'X-Unique-Upload-Id': `${XUniqueUploadId}`,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
          },
        }
      );
      return data;
    };

    const [videoData, thumbData] = await Promise.all([
      processVideo(),
      processThumbnail(),
    ]);

    createPost.mutateAsync({
      game: game[0].value,
      thumbnailUrl: thumbData.secure_url,
      title: titleRef.current.value,
      videoUrl: videoData.secure_url,
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
                  {fileRejections.length !== 0 && (
                    <Text weight={'bold'}>Arquivo muito grande</Text>
                  )}
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
              disabled={isSendingVideo}
              onClick={onClose}
              variant={'exit'}
              value="Sair"
            />
          </ModalClose>
          <Button
            disabled={!file}
            loading={isSendingVideo}
            onClick={processFile}
            value="Enviar"
          />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
