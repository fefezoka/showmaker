import * as HoverCard from '@radix-ui/react-hover-card';
import { styled, keyframes } from '../../style/stitches.config';
import Image from 'next/image';

const Fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Content = styled(HoverCard.Content, {
  color: '$white',
  backgroundColor: '$bg',
  borderRadius: '12px',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bgalt',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
});

export const Header = styled('div', {
  padding: '20px 20px 12px 20px',
  borderBottom: '2px solid $bgalt',
});

export const StyledImage = styled(Image, {
  transition: 'all 100ms',
  '&:hover': {
    opacity: '.7',
  },
});
