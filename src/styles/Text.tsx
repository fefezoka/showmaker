import { styled } from 'stitches.config';

export const Text = styled('span', {
  lineHeight: '1',
  margin: '0',
  fontVariantNumeric: 'tabular-nums',

  variants: {
    size: {
      '1': {
        fontSize: '$1',
      },
      '2': {
        fontSize: '$2',
      },
      '3': {
        fontSize: '$3',
      },
      '4': {
        fontSize: '$4',
      },
      '5': {
        fontSize: '$5',
        letterSpacing: '-.022em',
      },
      '6': {
        fontSize: '$6',
        letterSpacing: '-.024em',
      },
      '7': {
        fontSize: '$7',
        letterSpacing: '-.027em',
        textIndent: '-.005em',
      },
      '8': {
        fontSize: '$8',
        letterSpacing: '-.028em',
        textIndent: '-.018em',
      },
    },
    weight: {
      400: {
        fontWeight: 400,
      },
      500: {
        fontWeight: 500,
      },
      600: {
        fontWeight: 600,
      },
    },
    color: {
      primary: {
        color: '$text-primary',
      },
      secondary: {
        color: '$text-secondary',
      },
      'black-primary': {
        color: '$text-black-primary',
      },
      'black-secondary': {
        color: '$text-black-secondary',
      },
      'red-primary': {
        color: '$red-2',
      },
    },
  },

  defaultVariants: {
    size: '3',
    weight: 400,
    color: 'primary',
  },
});
