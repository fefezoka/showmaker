import React from 'react';
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

  '&:hover': {
    backgroundColor: '$bgalt',
  },

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
  },
});

export const FeedButton = ({ value, ...props }: ButtonProps) => {
  return (
    <StyledFeedButton type="button" {...props}>
      {value}
    </StyledFeedButton>
  );
};
