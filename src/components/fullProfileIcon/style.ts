import * as Dialog from '@radix-ui/react-dialog';
import { keyframes, styled } from '../../style/stitches.config';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Content = styled(Dialog.Content, {
  width: '460px',
  height: '460px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '$modal',
  overflow: 'hidden',
  animation: `200ms ${Fade}`,
});

export const Overlay = styled(Dialog.Overlay, {
  backgroundColor: '$overlay',
  zIndex: '$overlay',
  position: 'fixed',
  inset: 0,
  animation: `200ms ${Fade}`,
});
