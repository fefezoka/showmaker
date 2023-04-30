import React, { forwardRef } from 'react';
import Spinner from '../assets/Spinner.svg';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';
import { styled } from '../../stitches.config';

const StyledButton = styled('button', {
  display: 'flex',
  ai: 'center',
  jc: 'center',
  padding: '$3',
  bc: '$blue-2',
  minWidth: '64px',
  color: '$text-primary',
  fontSize: '$3',
  cursor: 'pointer',
  br: '$2',
  transition: 'background-color 200ms',
  fontWeight: 500,

  '&:hover': {
    bc: '$blue-1',
  },

  variants: {
    variant: {
      exit: {
        bc: '$red-1',
        borderColor: '$white-1',

        '&:hover': {
          bc: '$red-2',
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
  ({ Icon, loading, ...props }, forwardedRef) => {
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
