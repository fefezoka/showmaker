import { styled } from '../../styles/stitches.config';

export const Wrapper = styled('div', {
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',

  variants: {
    rounded: {
      half: {
        borderRadius: '20%',
      },
      full: {
        borderRadius: '50%',
      },
    },
  },
});
