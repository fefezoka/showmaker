import React, { forwardRef } from 'react';
import { styled } from '../../stitches.config';

const StyledFeedButton = styled('button', {
  fontSize: '$3',
  padding: '$3 $4',
  transition: 'border-bottom-color 300ms ease-out, font-weight 200ms ease-in',
  color: '$text-secondary',
  textAlign: 'center',
  flexShrink: 0,
  borderBottom: '2px solid transparent',
  fontWeight: 500,

  variants: {
    active: {
      true: {
        color: '$blue',
        borderBottomColor: '$blue-2',

        '&:hover': {
          borderBottomColor: '$blue-2 !important',
        },
      },
    },
    theme: {
      light: {
        color: '$text-black-primary',

        '&:hover': {
          borderBottomColor: '$black-1',
        },
      },
      dark: {
        '&:hover': {
          borderBottomColor: '$gray-1',
        },
      },
    },
  },

  defaultVariants: {
    theme: 'dark',
  },
});

export const FeedButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof StyledFeedButton>
>(({ ...props }: React.ComponentProps<typeof StyledFeedButton>, forwardedRef) => {
  return (
    <StyledFeedButton type="button" {...props} ref={forwardedRef}>
      {props.children}
    </StyledFeedButton>
  );
});

FeedButton.displayName = 'FeedButton';
