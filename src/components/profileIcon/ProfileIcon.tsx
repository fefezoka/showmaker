import Image from 'next/image';
import React from 'react';
import { Wrapper } from './style';

interface Props {
  src: string;
}

export const ProfileIcon = ({ src }: Props) => {
  return (
    <Wrapper>
      <Image alt="" src={src} fill style={{ objectFit: 'cover' }} />
    </Wrapper>
  );
};
