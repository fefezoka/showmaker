import Image from 'next/image';
import React, { forwardRef, useState } from 'react';
import { CSS, styled } from '../../stitches.config';
import discordFallback from '../assets/discord-fallback.png';

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
    const [error, setError] = useState(false);

    return (
      <Wrapper css={{ size: '$7', br: '$round', ...css }}>
        <Image
          ref={forwardedRef}
          src={error ? discordFallback : src}
          {...props}
          fill
          alt=""
          onError={() => setError(true)}
        />
      </Wrapper>
    );
  }
);

ProfileIcon.displayName = 'ProfileIcon';
