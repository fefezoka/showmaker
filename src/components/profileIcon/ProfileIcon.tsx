import Image from 'next/image';
import React from 'react';
import { Wrapper } from './style';

interface Props {
  src: string;
}

export const ProfileIcon = ({ src }: Props) => {
  return (
    <Wrapper>
      <Image alt="" src={src} width={32} height={32} />
    </Wrapper>
  );
};
