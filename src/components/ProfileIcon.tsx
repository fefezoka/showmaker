import Image from 'next/image';
import React from 'react';
import { CSS, styled } from '../../stitches.config';

interface Props extends React.ComponentProps<typeof Image> {
  src: string;
  css?: CSS;
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

export const ProfileIcon = ({
  src,
  css = { size: '36px' },
  rounded = 'full',
  ...props
}: Props) => {
  return (
    <Wrapper rounded={rounded} css={css}>
      <Image src={src} {...props} fill alt="" />
    </Wrapper>
  );
};
