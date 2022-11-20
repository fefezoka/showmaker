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

  variants: {
    variant: {
      exit: {
        backgroundColor: '$red',
        color: '$white',
        borderColor: '$white',
        fontWeight: 700,
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
  },
});
