import { styled } from '../../style/stitches.config';

export const Container = styled('div', {
  maxWidth: '1152px',
  margin: '0 auto',
  display: 'flex',
});

export const Main = styled('main', {
  borderRight: '2px solid',
  borderColor: '$bgalt',
  width: '100%',

  '& > section': {
    padding: '1rem',
    borderBottom: '2px solid',
    borderColor: '$bgalt',
  },

  '& section:first-of-type': {
    paddingTop: '1rem',
  },

  '@dsk2': {
    '& > section': {
      padding: '1.5rem',
    },
  },
});
