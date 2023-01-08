import Image from 'next/image';
import React from 'react';
import { Wrapper } from './style';

interface Props extends React.ComponentProps<typeof Image> {
  src: string;
  size?: number;
  rounded?: 'half' | 'full';
}

export const ProfileIcon = ({ src, size = 36, rounded = 'full', ...props }: Props) => {
  return (
    <Wrapper style={{ width: size, height: size }} rounded={rounded}>
      <Image src={src} {...props} width={size} height={size} alt="" />
    </Wrapper>
  );
};
