import { css, styled } from '../../style/stitches.config';

export const Main = styled('main', {
  maxWidth: '1152px',
  margin: '0 auto',
  display: 'flex',
});

export const Container = styled('section', {
  borderRight: '2px solid',
  borderColor: '$bgalt',

  '& > div': {
    padding: '1.5rem',
    borderBottom: '2px solid',
    borderColor: '$bgalt',
  },
});
