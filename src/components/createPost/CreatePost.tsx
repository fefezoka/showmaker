import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Dropzone from 'react-dropzone';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../button/Button';
import { StyledOverlay, StyledContent, DropContainer, Input } from './style';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { IoAdd } from 'react-icons/io5';
import { useIsDesktop } from '../../hooks/useIsDesktop';
import { getVideoFrame } from '../../utils/getVideoFrame';
import { useQueryClient } from 'react-query';

const CreatePost = () => {
  const queryClient = useQueryClient();
  const titleRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string>();
  const isDesktop = useIsDesktop();

  const onClose = () => {
    setOpen(false);
    setFile(undefined);
    setLoading(false);
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
      if (status === 'authenticated') {
        const { data } = await axios.post('/api/post/insert', {
          ...session.user,
          title: titleRef.current?.value,
          thumbnailUrl: thumbnailUrl,
          videoUrl: videoUrl,
        });
        queryClient.setQueryData(['post', data.id], data);
        queryClient.refetchQueries();
        onClose();
      }
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
        <StyledContent>
          <Dialog.Title>Postar vídeo</Dialog.Title>
          <Dialog.Description>
            Compartilhe suas jogadas favoritas com a comunidade!
          </Dialog.Description>
          <div style={{ margin: '24px 0px 12px 0px' }}>
            <label htmlFor="name">Título</label>
            <Input id="name" ref={titleRef} />
          </div>
          <div>
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
                <section>
                  <DropContainer
                    {...getRootProps()}
                    active={isDragActive || acceptedFiles.length !== 0}
                  >
                    {fileRejections.length !== 0 && <p>Arquivo muito grande</p>}
                    {file ? (
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {thumbnail && (
                          <Image src={thumbnail} alt="" width={160} height={90} />
                        )}
                        <p style={{ lineBreak: 'anywhere' }}>
                          {file?.name} - {(file?.size / 1048576).toFixed(2)} MB{' '}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p>Arraste um vídeo ou clique para procurar</p>
                        <p>Limite de 100MB</p>
                      </>
                    )}
                  </DropContainer>
                </section>
              )}
            </Dropzone>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
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
          </div>
        </StyledContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePost;
