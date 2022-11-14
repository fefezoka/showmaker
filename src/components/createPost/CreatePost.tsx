import React, { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '../button/Button';
import { Overlay, Content, DropContainer, Input } from './style';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';

export const CreatePost = () => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();

  const onClose = () => {
    setOpen(false);
    setFile(undefined);
    setLoading(false);
  };

  const processFile = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    const YOUR_CLOUD_NAME = 'dlgkvfmky';
    const POST_URL = 'https://api.cloudinary.com/v1_1/' + YOUR_CLOUD_NAME + '/upload';
    const XUniqueUploadId = +new Date();

    processFile();

    function processFile() {
      if (!file) {
        return;
      }
      const size = file.size;
      const sliceSize = 20000000;
      var start = 0;

      setTimeout(loop, 3);

      function loop() {
        if (!file) {
          return;
        }

        var end = start + sliceSize;

        if (end > size) {
          end = size;
        }
        var s = slice(file, start, end);
        send(s, start, end - 1, size);
        if (end < size) {
          start += sliceSize;
          setTimeout(loop, 3);
        }
      }
    }

    function send(piece: File, start: number, end: number, size: number) {
      var formdata = new FormData();

      formdata.append('file', piece);
      formdata.append('cloud_name', 'dlgkvfmky');
      formdata.append('upload_preset', 'tamnuopz');

      var xhr = new XMLHttpRequest();
      xhr.open('POST', POST_URL, true);
      xhr.setRequestHeader('X-Unique-Upload-Id', `${XUniqueUploadId}`);
      xhr.setRequestHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + size);

      xhr.onload = async function () {
        const response = JSON.parse(xhr.response);
        console.log(response);
        if (response.done !== false && status === 'authenticated') {
          await axios.post('/api/post/insert', {
            ...session.user,
            title: titleRef!.current!.value,
            url: response.secure_url,
          });
          onClose();
        }
      };

      xhr.send(formdata);
    }

    function slice(file: File, start: number, end: number) {
      var slice = file.slice;

      return slice.bind(file)(start, end) as File;
    }
  };

  return (
    <Dialog.Root open={session && open ? true : false} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button onClick={() => !session && signIn('discord')} value="Postar vídeo" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
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
              onDrop={(files) => {
                setFile(files[0]);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <DropContainer {...getRootProps()}>
                    <input {...getInputProps()} />
                    {file ? (
                      <p>
                        {file?.name} - {(file?.size / 1000000).toFixed(2)} MB{' '}
                      </p>
                    ) : (
                      <p>Arraste um vídeo ou clique para procurar</p>
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
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
