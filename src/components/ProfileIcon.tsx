import Image from 'next/image';
import React, { forwardRef } from 'react';
import { CSS, styled } from '../../stitches.config';

interface Props extends React.ComponentProps<typeof Image> {
  src: string;
  css?: CSS;
}

export const Wrapper = styled('div', {
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
});

export const ProfileIcon = forwardRef<HTMLImageElement, Props>(
  ({ src, css, ...props }: Props, forwardedRef) => {
    return (
      <Wrapper css={{ size: '$7', br: '$round', ...css }}>
        <Image ref={forwardedRef} src={src} {...props} fill alt="" />
      </Wrapper>
    );
  }
);

ProfileIcon.displayName = 'ProfileIcon';
