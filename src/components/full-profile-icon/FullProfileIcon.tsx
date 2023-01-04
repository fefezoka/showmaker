import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { Content, Overlay } from './style';
import { ProfileIcon } from '../profileIcon/ProfileIcon';

interface Props {
  src: string;
  size?: number;
}

export const FullProfileIcon = ({ src, size = 32 }: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>
          <ProfileIcon src={src} size={size} alt="" />
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
