import { Box } from '@styles';
import React from 'react';
import { styled } from 'stitches.config';

const StyledInput = styled('input', {
  width: '100%',
  padding: '$3 $5',
  border: 'none',
  borderRadius: '$7',
  fontSize: '$3',
  backgroundColor: '$bg-2',
  color: '$text-primary',
  minHeight: 40,

  '&::placeholder': {
    color: '$text-secondary',
    fontSize: '$2',
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
