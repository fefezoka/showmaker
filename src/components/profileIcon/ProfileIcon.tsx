import Image from 'next/image';
import React from 'react';
import { Wrapper } from './style';

interface Props {
  src: string;
  size?: number;
}

export const ProfileIcon = ({ src, size = 32 }: Props) => {
  return (
    <Wrapper style={{ width: size, height: size }}>
      <Image alt="" src={src} width={size} height={size} />
    </Wrapper>
  );
};
