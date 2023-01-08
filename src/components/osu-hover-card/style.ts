import { styled } from '../../styles/stitches.config';
import * as HoverCard from '@radix-ui/react-hover-card';

export const Content = styled(HoverCard.Content, {
  position: 'relative',
  zIndex: '$modal',
  width: '300px',
  height: '120px',
  backgroundColor: 'black',
  color: '$white',
  borderRadius: '8px',
  fontSize: '$3',
  padding: '12px 10px',
  overflow: 'hidden',
  fontWeight: 'bold',
});
