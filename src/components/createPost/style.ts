import { keyframes, styled } from '../../style/stitches.config';
import { Overlay, Content } from '@radix-ui/react-dialog';

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const StyledOverlay = styled(Overlay, {
  backgroundColor: '$overlay',
  position: 'fixed',
  inset: 0,
  animation: `${fade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: '$overlay',
});

export const StyledContent = styled(Content, {
  padding: '2rem 1.5rem',
  top: '50%',
  left: '50%',
  borderRadius: '8px',
  width: 'calc(100% - 20px)',
  transform: 'translate(-50%, -50%)',
  position: 'fixed',
  backgroundColor: '$modal',
  color: '$black',
  animation: `${fade} 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
  zIndex: '$modal',

  '@dsk1': {
    width: '420px',
  },
});

export const DropContainer = styled('section', {
  width: '100%',
  height: '120px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  border: '2px dashed',
  borderColor: '$bg',
  margin: '12px 0px',
  borderRadius: '8px',
  padding: '.875rem',
  cursor: 'pointer',

  variants: {
    active: {
      true: {
        borderColor: '$blue',
      },
    },
  },
});

export const Input = styled('input', {
  backgroundColor: 'white',
  padding: '12px 12px',
  borderRadius: '8px',
  width: '100%',
  border: '1px solid',
  margin: '4px 0px',
  borderColor: '$input-gray',
});
