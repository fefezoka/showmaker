import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { ProfileIcon } from './';
import { keyframes, styled, CSS } from '../../stitches.config';

interface Props {
  src: string;
  css?: CSS;
}

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Content = styled(Dialog.Content, {
  width: 'calc(100vw - 60px)',
  height: 'calc(100vw - 60px)',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '$modal',
  overflow: 'hidden',
  animation: `200ms ${Fade}`,

  '@dsk2': {
    width: '460px',
    height: '460px',
  },
});

export const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '$overlay',
  zIndex: '$overlay',
  position: 'fixed',
  inset: 0,
  animation: `200ms ${Fade}`,
});

export const FullProfileIcon = ({ src, css }: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>
          <ProfileIcon src={src} css={{ size: '36px', ...css }} alt="" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Image src={src + '?size=512'} alt="" fill sizes="" />
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
