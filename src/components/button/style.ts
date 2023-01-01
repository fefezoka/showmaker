import { styled } from '../../style/stitches.config';

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
  maxHeight: '42px',

  variants: {
    variant: {
      exit: {
        backgroundColor: '$red',
        color: '$white',
        borderColor: '$white',
        fontWeight: 700,
      },
      profile: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        fontSize: '1rem',
        padding: '16px',
        transition: 'all 200ms',

        '&:hover': {
          backgroundColor: '$bgalt',
        },

        '@dsk2': {
          fontSize: '1.125rem',
        },
      },
      disabled: {
        backgroundColor: '$bgalt',
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
        backgroundColor: '$bgalt',
      },
    },
  },
});
