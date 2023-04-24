import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import { signIn, useSession } from 'next-auth/react';
import { styled } from '../../stitches.config';
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';
import { getVideoFrame } from '../utils/getVideoFrame';
import { useIsDesktop, useCreatePost } from '@hooks';
import { Button, Input, Select } from '@components';
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
  Heading,
} from '@styles';

export default function CreatePost() {
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const [isSendingVideo, setIsSendingVideo] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const gameSelectRef = useRef<React.ElementRef<typeof Select>>(null);
  const titleRef = useRef<React.ElementRef<typeof Input>>(null);
  const { data: session } = useSession();
  const createPost = useCreatePost();
  const isDesktop = useIsDesktop();

  const onClose = () => {
    setIsSendingVideo(false);
    setOpen(false);
    setFile(undefined);
    setThumbnail(undefined);
    setUploadProgress(0);
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
          onUploadProgress(progressEvent) {
            setUploadProgress((start + progressEvent.loaded) / size);
          },
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
          <Button onClick={() => !session && signIn('discord')}>Postar vídeo</Button>
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
          isSendingVideo ? e.preventDefault() : onClose()
        }
      >
        <ModalTitle asChild>
          <Heading size="3" color={'primary'} css={{ lh: 'unset' }}>
            Postar vídeo
          </Heading>
        </ModalTitle>
        <ModalDescription asChild>
          <Text color={'secondary'} size={'4'}>
            Compartilhe suas jogadas favoritas com a comunidade!
          </Text>
        </ModalDescription>
        <Box css={{ mt: '$5' }}>
          <Text as={'label'} color={'primary'}>
            Título
          </Text>
          <Input ref={titleRef} css={{ br: '$1', px: '$3' }} />

          <Box css={{ mt: '$1' }}>
            <Text as={'label'} color={'primary'}>
              Jogo
            </Text>
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
              <Flex
                justify={'center'}
                direction={'column'}
                align={'center'}
                css={{
                  width: '100%',
                  height: '120px',
                  border: '2px dashed $gray-2',
                  mt: '$4',
                  borderRadius: '$2',
                  padding: '$3',
                  cursor: 'pointer',
                  ...((isDragActive || acceptedFiles.length !== 0) && {
                    borderColor: '$blue-1',
                  }),
                }}
                {...getRootProps()}
              >
                {file ? (
                  <Flex gap={'3'} justify={'between'} css={{ width: '100%' }}>
                    {thumbnail && (
                      <Box
                        as={Image}
                        src={thumbnail}
                        alt=""
                        width={110}
                        height={90}
                        css={{ objectFit: 'cover' }}
                      />
                    )}
                    <Flex
                      direction={'column'}
                      justify={'between'}
                      css={{ width: '100%' }}
                    >
                      <Text as={'p'} weight={600} css={{ lineBreak: 'anywhere' }}>
                        {file.name}
                      </Text>
                      <Box>
                        <Text size={'2'} color={'primary'}>
                          {((file.size / 1048576) * uploadProgress).toFixed(0)} MB /{' '}
                          {(file.size / 1048576).toFixed(0)} MB
                        </Text>
                        <Flex align={'center'} gap={'2'} css={{ mt: '2px' }}>
                          <Box
                            css={{
                              height: '$2',
                              width: '100%',
                              backgroundColor: '$bg-2',
                              br: '$1',
                              position: 'relative',
                              border: '1px solid $bg-3',
                            }}
                          >
                            <Box
                              css={{
                                width: (uploadProgress * 100).toFixed(0) + '%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                bc: '$blue-1',
                                br: '$1',
                              }}
                            />
                          </Box>
                          <Text size={'2'} color={'primary'}>
                            {(uploadProgress * 100).toFixed(0)}%
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Flex>
                ) : (
                  <Flex direction={'column'} align={'center'} gap={'1'}>
                    {fileRejections.length !== 0 && (
                      <Text weight={600} color={'primary'}>
                        Arquivo muito grande
                      </Text>
                    )}
                    <Text color={'secondary'}>
                      Arraste um vídeo ou clique para procurar
                    </Text>
                    <Text color={'secondary'}>Limite de 100 MB</Text>
                  </Flex>
                )}
              </Flex>
            )}
          </Dropzone>
        </Box>
        <Flex justify={'between'} align={'center'} css={{ mt: '$4' }}>
          <ModalClose asChild>
            <Button disabled={isSendingVideo} onClick={onClose} variant={'exit'}>
              Sair
            </Button>
          </ModalClose>
          <Button disabled={!file} loading={isSendingVideo} onClick={processFile}>
            Enviar
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
