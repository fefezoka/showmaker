import { css, styled } from '../../style/stitches.config';

export const Button = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 20px',
  backgroundColor: '#5892fc',
  border: '1px solid #3c6ec9',
  minWidth: '84px',
  color: 'white',
  fontSize: '.875rem',
  cursor: 'pointer',
  borderRadius: '8px',

  variants: {
    variant: {
      exit: {
        backgroundColor: 'unset',
        border: '2px solid #5892fc',
        color: '#5892fc',
      },
      disabled: {
        backgroundColor: '#3c6ec9',
      },
    },
  },
});
