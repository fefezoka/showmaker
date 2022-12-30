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

export const Content = styled(HoverCard.Content, {
  color: '$white',
  backgroundColor: '$bg',
  borderRadius: '12px',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bgalt',
  transition: 'all 200ms ease-out',
  animation: `250ms ${Fade}`,
  boxShadow: '0px 0px 8px black',
});

export const Header = styled('div', {
  padding: '20px 20px 12px 20px',
  borderBottom: '2px solid $bgalt',
});

export const Post = styled('section', {
  width: 'calc(100%/3)',
  textAlign: 'center',
  overflow: 'hidden',

  '&:nth-of-type(1)': {
    borderBottomLeftRadius: '8px',
  },

  '&:nth-of-type(3)': {
    borderBottomRightRadius: '8px',
  },
});

export const ImageWrapper = styled('div', {
  marginTop: '4px',
  transition: 'all 100ms',
  overflow: 'hidden',
  paddingTop: '75%',
  width: '100%',
  position: 'relative',
  cursor: 'pointer',

  img: {
    objectFit: 'cover',
  },

  '&:hover': {
    opacity: '.7',
  },
});
