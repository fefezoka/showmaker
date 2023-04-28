import React, { forwardRef } from 'react';
import Spinner from '../assets/Spinner.svg';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';
import { styled } from '../../stitches.config';

const StyledButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$3',
  backgroundColor: '$blue-2',
  minWidth: '64px',
  color: '$text-primary',
  fontSize: '$3',
  cursor: 'pointer',
  borderRadius: '$2',
  transition: 'background-color 200ms',
  fontWeight: 500,

  '&:hover': {
    backgroundColor: '$blue-1',
  },

  variants: {
    variant: {
      exit: {
        backgroundColor: '$red-1',
        borderColor: '$white-1',

        '&:hover': {
          backgroundColor: '$red-2',
        },
      },
    },
  },
});

interface IButton extends React.ComponentProps<typeof StyledButton> {
  loading?: boolean;
  Icon?: IconType;
}

export const Button = forwardRef<HTMLButtonElement, IButton>(
  ({ Icon, loading, ...props }: IButton, forwardedRef) => {
    return (
      <StyledButton type="button" {...props} ref={forwardedRef}>
        {loading && <Image src={Spinner} height={18} width={18} alt="" />}
        {Icon && <Icon size={18} />}
        {!loading && !Icon && props.children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
