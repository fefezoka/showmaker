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
  backgroundColor: '$blue',
  minWidth: '64px',
  color: 'white',
  fontSize: '$3',
  cursor: 'pointer',
  borderRadius: '$2',
  transition: 'all 200ms',

  '&:hover': {
    backgroundColor: '$bluealt',
  },

  variants: {
    variant: {
      exit: {
        backgroundColor: '$red',
        color: '$white',
        borderColor: '$white',
        fontWeight: 700,

        '&:hover': {
          backgroundColor: '$redalt',
        },
      },
    },
    radius: {
      full: {
        borderRadius: '$round',
        minWidth: 'unset',
      },
    },
  },
});

interface Props extends React.ComponentProps<typeof StyledButton> {
  value?: string;
  loading?: boolean;
  Icon?: IconType;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ value, Icon, loading, ...props }: Props, forwardedRef) => {
    return (
      <StyledButton {...props} ref={forwardedRef}>
        {loading && <Image src={Spinner} height={18} width={18} alt="" />}
        {Icon && <Icon size={18} />}
        {!loading && !Icon && value}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
