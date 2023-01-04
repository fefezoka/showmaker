import { styled } from '../../styles/stitches.config';

export const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  backgroundColor: '$blue',
  border: '1px solid',
  borderColor: '$bluealt',
  minWidth: '84px',
  color: 'white',
  fontSize: '.875rem',
  cursor: 'pointer',
  borderRadius: '8px',
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
      profile: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        fontSize: '.875rem',
        padding: '16px',
        transition: 'all 200ms',
        maxHeight: '42px',

        '&:hover': {
          backgroundColor: '$bgalt',
        },

        '@dsk2': {
          fontSize: '1rem',
        },
      },
    },
    radius: {
      full: {
        borderRadius: '50%',
        minWidth: 'unset',
      },
    },
    active: {
      true: {
        fontWeight: 'bold',
      },
    },
  },
});
