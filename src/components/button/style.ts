import { css, styled } from '../../style/stitches.config';

export const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 20px',
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
  },
});
