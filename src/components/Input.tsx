import { Box } from '@styles';
import React from 'react';
import { styled } from 'stitches.config';

const StyledInput = styled('input', {
  width: '100%',
  px: '$5',
  border: 'none',
  br: '$7',
  fontSize: '$3',
  bc: '$bg-2',
  color: '$text-primary',
  minHeight: 40,

  '&::placeholder': {
    color: '$text-secondary',
    fontSize: '$2',
  },

  variants: {
    radius: {
      '1': {
        br: '$1',
        px: '$3',
      },
      '2': {
        br: '$7',
        px: '$5',
      },
    },
  },

  defaultVariants: {
    radius: '1',
  },
});

export const Input = React.forwardRef<
  React.ElementRef<typeof StyledInput>,
  React.ComponentProps<typeof StyledInput>
>(({ ...props }, forwardedRef) => {
  return (
    <Box css={{ size: '100%', position: 'relative' }}>
      <StyledInput {...props} ref={forwardedRef} />
    </Box>
  );
});

Input.displayName = 'Input';
