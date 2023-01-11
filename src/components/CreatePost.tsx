import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { IoAdd } from 'react-icons/io5';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { getVideoFrame } from '../utils/getVideoFrame';
import { useQueryClient } from 'react-query';
import { Box, Flex, Text } from '../styles';
import { keyframes, styled } from '../../stitches.config';

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

const StyledOverlay = styled(Dialog.Overlay, {
  backgroundColor: '$overlay',
  position: 'fixed',
  inset: 0,
  animation: `${fade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: '$overlay',
});

const StyledContent = styled(Dialog.Content, {
  padding: '$6',
  top: '50%',
  left: '50%',
  borderRadius: '8px',
  width: 'calc(100% - 20px)',
  transform: 'translate(-50%, -50%)',
  position: 'fixed',
  backgroundColor: '$modal',
  color: '$black',
  animation: `${fade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: '$modal',

  '@bp2': {
    width: '400px',
  },
});

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

const Input = styled('input', {
  backgroundColor: 'white',
  padding: '$3',
  borderRadius: '$2',
  width: '100%',
  border: '1px solid $input-gray',
  margin: '$1 0px',
});

const CreatePost = () => {
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isDesktop = useIsDesktop();

  const onClose = () => {
    setOpen(false);
    setFile(undefined);
    setLoading(false);
    setThumbnail(undefined);
  };

  const processFile = async () => {
    if (loading || !file || !thumbnail || !titleRef.current?.value) {
      return;
    }
    setLoading(true);

    const XUniqueUploadId = +new Date();

    const processThumbnail = async () => {
      const formdata = new FormData();
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('file', thumbnail);
      formdata.append('upload_preset', 'gjfsvh53');

      const { data } = await axios.post(
        'https://api.cloudinary.com/v1_1/dlgkvfmky/upload',
        formdata
      );
      return data;
    };

    const processVideo = async () => {
      const size = file.size;
      const sliceSize = 20000000;
      var start = 0;

      const thumbData = await processThumbnail();

      const loop = async () => {
        var end = start + sliceSize;

        if (end > size) {
          end = size;
        }

        const piece = file.slice.bind(file)(start, end) as File;
        const videoData = await sendVideoPiece(piece, start, end - 1, size);
        if (end < size) {
          start += sliceSize;
          setTimeout(loop, 3);
        } else {
          await processPostOnDb(thumbData.secure_url, videoData.secure_url);
        }
      };

      setTimeout(loop, 3);
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

    const processPostOnDb = async (thumbnailUrl: string, videoUrl: string) => {
      const { data } = await axios.post<Post>('/api/post/insert', {
        ...session?.user,
        title: titleRef.current?.value,
        thumbnailUrl: thumbnailUrl,
        videoUrl: videoUrl,
      });

      queryClient.setQueryData<{ pages: [{ id: string }][] } | undefined>(
        'homepageIds',
        (old) => (old?.pages[0].unshift({ id: data.id }) ? old : undefined)
      );

      queryClient.setQueryData<{ pages: [{ id: string }][] } | undefined>(
        ['userposts', session?.user.name],
        (old) => (old?.pages[0].unshift({ id: data.id }) ? old : undefined)
      );

      queryClient.setQueryData<Post>(['post', data.id], data);
      onClose();
    };

    processVideo();
  };

  return (
    <Dialog.Root open={session && open ? true : false} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {isDesktop ? (
          <Button onClick={() => !session && signIn('discord')} value="Postar vídeo" />
        ) : (
          <Button
            Icon={IoAdd}
            radius="full"
            onClick={() => !session && signIn('discord')}
          />
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <StyledOverlay />
        <StyledContent
          onInteractOutside={(e) => (loading ? e.preventDefault() : onClose())}
        >
          <Dialog.Title>Postar vídeo</Dialog.Title>
          <Dialog.Description>
            Compartilhe suas jogadas favoritas com a comunidade!
          </Dialog.Description>
          <Box css={{ mt: '$6' }}>
            <Text as={'label'} htmlFor="name">
              Título
            </Text>
            <Input id="name" ref={titleRef} />
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
                          {file?.name} - {(file?.size / 1048576).toFixed(2)} MB{' '}
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
            <Dialog.Close asChild>
              <Button
                disabled={loading}
                onClick={onClose}
                variant={'exit'}
                value="Sair"
              />
            </Dialog.Close>
            <Button
              loading={loading}
              disabled={!file}
              onClick={processFile}
              value="Enviar"
            />
          </Flex>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePost;
