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
  backgroundColor: '$bgalt',
  color: '$text-primary',

  '&::placeholder': {
    color: '$text-secondary',
  },

  variants: {
    theme: {
      light: {
        backgroundColor: 'white',
        padding: '$3',
        borderRadius: '$1',
        border: '1px solid $input-gray',
        transition: '100ms all',

        '&:focus': {
          border: '1px solid #2684ff',
          boxShadow: '0 0 0 1px #2684ff',
        },
      },
    },
  },
});

export const Input = ({ Icon, ...props }: InputProps) => {
  return (
    <Box css={{ size: '100%', position: 'relative' }}>
      <StyledInput {...props} />
      {Icon && (
        <Box css={{ position: 'absolute', right: '$4', top: '$3' }}>
          <Box as={'button'} type="submit">
            <Icon color="white" />
          </Box>
        </Box>
      )}
    </Box>
  );
};
