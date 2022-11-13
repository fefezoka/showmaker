import { styled } from '../../style/stitches.config';

export const Menu = styled('aside', {
  borderRight: '2px solid',
  borderColor: '$bgalt',
  minWidth: '58px',

  '@dsk2': {
    minWidth: '240px',
  },
});

export const Row = styled('li', {
  color: '$gray',

  '&:first-of-type': {
    color: '$white',
  },

  '&:hover': {
    color: '$white',
  },

  variants: {
    active: {
      true: {
        color: '$white',
      },
    },
  },
});

export const Line = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  minHeight: '68px',
  padding: '16px 20px',

  h3: {
    display: 'none',
  },

  '@dsk2': {
    h3: {
      display: 'block',
    },
  },
});
