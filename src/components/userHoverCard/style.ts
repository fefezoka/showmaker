import * as HoverCard from '@radix-ui/react-hover-card';
import { styled, keyframes } from '../../style/stitches.config';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '12px',
});

export const Content = styled(HoverCard.Content, {
  color: '$white',
  backgroundColor: '$bg',
  borderRadius: '12px',
  width: '440px',
  zIndex: '$modal',
  border: '1px solid',
  borderColor: '$white',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
});
