import Image from 'next/image';
import React from 'react';
import { Wrapper } from './style';

interface Props extends React.ComponentProps<typeof Image> {
  src: string;
  size?: number;
}

export const ProfileIcon = ({ src, size = 36, ...props }: Props) => {
  return (
    <Wrapper style={{ width: size, height: size }}>
      <Image src={src} {...props} width={size} height={size} alt="" />
    </Wrapper>
  );
};
