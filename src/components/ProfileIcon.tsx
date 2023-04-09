import Image from 'next/image';
import React, { forwardRef, useState } from 'react';
import { CSS, styled } from '../../stitches.config';

interface ProfileIconProps extends React.ComponentProps<typeof Image> {
  src: string;
  css?: CSS;
}

export const Wrapper = styled('div', {
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
});

export const ProfileIcon = forwardRef<HTMLImageElement, ProfileIconProps>(
  ({ src, css, ...props }: ProfileIconProps, forwardedRef) => {
    const [error, setError] = useState(false);

    return (
      <Wrapper css={{ size: '$7', br: '$round', ...css }}>
        <Image
          ref={forwardedRef}
          src={!error ? src : 'https://cdn.discordapp.com/embed/avatars/0.png'}
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
