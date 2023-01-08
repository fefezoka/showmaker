import Image from 'next/image';
import React from 'react';
import { styled } from '../../stitches.config';

interface Props extends React.ComponentProps<typeof Image> {
  src: string;
  size?: number;
  rounded?: 'half' | 'full';
}

export const Wrapper = styled('div', {
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',

  variants: {
    rounded: {
      half: {
        borderRadius: '20%',
      },
      full: {
        borderRadius: '50%',
      },
    },
  },
});

export const ProfileIcon = ({ src, size = 36, rounded = 'full', ...props }: Props) => {
  return (
    <Wrapper rounded={rounded} css={{ size: size }}>
      <Image src={src} {...props} width={size} height={size} alt="" />
    </Wrapper>
  );
};
