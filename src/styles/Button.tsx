import React, { forwardRef } from 'react';
import Spinner from '../assets/Spinner.svg';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';

const StyledButton = styled('button', {
  all: 'unset',
  ai: 'center',
  boxSizing: 'border-box',
  us: 'none',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  display: 'inline-flex',
  jc: 'center',
  flexShrink: 0,
  cursor: 'pointer',

  color: '$text-primary',
  br: '$1',
  fontWeight: 500,
  transition: 'background-color 200ms, border-bottom-color 300ms ease-out',

  '&:hover': {
    bc: '$blue-1',
  },

  variants: {
    size: {
      1: {
        minWidth: 52,
        px: '$2',
        fontSize: '$1',
        height: '$7',
      },
      2: {
        minWidth: 80,
        fontSize: '$3',
        px: '$3',
        height: '$8',
      },
    },
    variant: {
      red: {
        bc: '$red-2',
        boxShadow: 'inset 0 0 0 1px $colors$red-1',

        '&:hover': {
          bc: '$red-2',
        },
      },
      blue: {
        bc: '$blue-2',
        boxShadow: 'inset 0 0 0 1px $colors$blue-1',

        '&:hover': {
          bc: '$blue-1',
        },
      },
    },
    ghost: {
      true: {
        br: 0,
        bc: 'transparent',
        borderBottom: '2px solid transparent',
        px: '$4',
        color: '$text-secondary',
        boxShadow: 'none',

        '&:hover': {
          bc: 'transparent',
          borderBottomColor: '$gray-1',
        },
      },
    },
    active: {
      true: {
        fontWeight: 600,
      },
    },
  },

  compoundVariants: [
    {
      variant: 'blue',
      ghost: true,
      active: true,
      css: {
        color: '$blue-2',
        borderBottomColor: '$blue-2',

        '&:hover': {
          borderBottomColor: '$blue-2 !important',
        },
      },
    },
    {
      variant: 'red',
      ghost: true,
      active: true,
      css: {
        color: '$red-2',
        borderBottomColor: '$red-2',

        '&:hover': {
          borderBottomColor: '$red-2 !important',
        },
      },
    },
  ],

  defaultVariants: {
    size: 2,
    variant: 'blue',
    active: false,
    ghost: false,
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
