import React, { forwardRef } from 'react';
import { styled } from '../../stitches.config';

interface ButtonProps extends React.ComponentProps<typeof StyledFeedButton> {
  value: string;
}

const StyledFeedButton = styled('button', {
  fontSize: '$3',
  padding: '$3 $4',
  transition: 'background-color 200ms',
  color: '$white',
  textAlign: 'center',
  flexShrink: 0,

  '@bp2': {
    fontSize: '15px',
  },

  variants: {
    active: {
      true: {
        color: '$blue',
        fontWeight: 'bold',
        borderBottom: '3px solid $blue',
      },
    },
    theme: {
      dark: {
        '&:hover': {
          backgroundColor: '$bgalt',
        },
      },
      light: {
        color: '$black',

        '&:hover': {
          fontWeight: 'bold',
        },
      },
    },
  },
  defaultVariants: {
    theme: 'dark',
  },
});

export const FeedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ value, ...props }: ButtonProps, forwardedRef) => {
    return (
      <StyledFeedButton type="button" {...props} ref={forwardedRef}>
        {value}
      </StyledFeedButton>
    );
  }
);

FeedButton.displayName = 'FeedButton';
