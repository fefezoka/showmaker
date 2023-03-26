import React, { useRef, useState } from 'react';
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
  animation: `300ms ${Fade}`,

  '@bp2': {
    width: '460px',
    height: '460px',
  },
});

export const Overlay = styled(Dialog.Overlay, {
  backdropFilter: 'blur(8px)',
  backgroundColor: '$overlay',
  zIndex: '$overlay',
  position: 'fixed',
  inset: 0,
  animation: `300ms ${Fade}`,
});

export const FullProfileIcon = ({ src, css }: Props) => {
  const profileIconRef = useRef<HTMLImageElement>(null);
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    if (open === true) {
      return setOpen(false);
    }

    if (!profileIconRef.current?.currentSrc.includes('embed')) {
      setOpen(true);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <ProfileIcon
          ref={profileIconRef}
          src={src}
          css={{ size: '$7', cursor: 'pointer', ...css }}
          alt=""
        />
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
