import { styled } from '../../style/stitches.config';

export const Menu = styled('aside', {
  borderRight: '2px solid',
  borderColor: '$bgalt',
  minWidth: '42px',
  position: 'relative',
  zIndex: '$modal',

  '@dsk2': {
    minWidth: '240px',
  },
});

export const Nav = styled('nav', {
  position: 'fixed',
  display: 'flex',
  flexDirection: 'column',

  a: {
    width: '100%',
  },
});

export const ButtonWrapper = styled('div', {
  position: 'fixed',
  right: 36,
  bottom: 36,

  '@dsk2': {
    position: 'unset',
    padding: '16px',
  },
});

export const Line = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$gray',
  padding: '16px 8px',
  minHeight: '70px',

  '&:hover': {
    color: '$white',
  },

  '@dsk2': {
    justifyContent: 'left',
    padding: '16px',
  },

  variants: {
    active: {
      true: {
        color: '$white',
      },
    },
  },
});
