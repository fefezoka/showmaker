import { css, styled } from 'stitches.config';

export const overlayStyles = css({
  backgroundColor: '$overlay',
  position: 'fixed',
  inset: 0,
  zIndex: '$overlay',
});

export const Overlay = styled('div', overlayStyles);
