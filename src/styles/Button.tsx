import React, { forwardRef } from 'react';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';
import { spinner } from '@/assets';

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
  fs: 0,
  cursor: 'pointer',
  br: '$pill',
  color: 'white',
  fontWeight: 600,
  transition: 'background-color 200ms, border-bottom-color 300ms ease-out',
  letterSpacing: '-.022em',

  variants: {
    size: {
      1: {
        minWidth: 72,
        px: '$3',
        fontSize: '$1',
        height: 36,
      },
      2: {
        minWidth: 88,
        fontSize: '$3',
        px: '$4',
        height: 40,
      },
    },
    variant: {
      red: {
        bc: '$red10',
        bs: 'inset 0 0 0 1px $colors$red9',

        '&:hover': {
          bc: '$red9',
        },
      },
      blue: {
        bc: '$blue10',
        bs: 'inset 0 0 0 1px $colors$blue9',

        '&:hover': {
          bc: '$blue9',
        },
      },
    },
    ghost: {
      true: {
        br: 0,
        bc: 'transparent',
        borderBottom: '2px solid transparent',
        px: '$4',
        color: '$slate11',
        bs: 'none',

        '&:hover': {
          bc: 'transparent',
          borderBottomColor: '$bg4',
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
        color: '$blue10',
        borderBottomColor: '$blue10',

        '&:hover': {
          borderBottomColor: '$blue10 !important',
        },
      },
    },
    {
      variant: 'red',
      ghost: true,
      active: true,
      css: {
        color: '$red10',
        borderBottomColor: '$red10',

        '&:hover': {
          borderBottomColor: '$red10 !important',
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
        {loading && <Image src={spinner} height={18} width={18} alt="" />}
        {Icon && <Icon size={18} />}
        {!loading && !Icon && props.children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
