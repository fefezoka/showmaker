import { Box } from '@styles';
import React from 'react';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';

interface InputProps extends React.ComponentProps<typeof StyledInput> {
  Icon?: IconType;
}

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

export const Input = React.forwardRef<React.ElementRef<typeof StyledInput>, InputProps>(
  ({ Icon, ...props }: InputProps, forwardedRef) => {
    return (
      <Box css={{ size: '100%', position: 'relative' }}>
        <StyledInput {...props} ref={forwardedRef} />
        {Icon && (
          <Box css={{ position: 'absolute', right: '$4', top: '$3' }}>
            <Box as={'button'} type="submit">
              <Icon color="white" />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

Input.displayName = 'Input';