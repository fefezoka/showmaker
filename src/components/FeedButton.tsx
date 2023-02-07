import React from 'react';
import { styled } from '../../stitches.config';

interface Props extends React.ComponentProps<typeof StyledFeedButton> {
  value: string;
}

const StyledFeedButton = styled('button', {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  fontSize: '$3',
  padding: '$3 $4',
  transition: 'background-color 200ms',
  color: '$white',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '$bgalt',
  },

  '@bp2': {
    fontSize: '$4',
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

export const FeedButton = ({ value, ...props }: Props) => {
  return (
    <StyledFeedButton type="button" {...props}>
      {value}
    </StyledFeedButton>
  );
};
