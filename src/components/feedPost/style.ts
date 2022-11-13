import { styled } from '../../style/stitches.config';

export const Container = styled('div', {
  padding: '1.5rem',
  borderBottom: '2px solid',
  borderRight: '2px solid',
  borderColor: '$bgalt',
});

export const VideoWrapper = styled('div', {
  overflow: 'hidden',
  width: '100%',
  borderRadius: '32px',
});

export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '12px',
});

export const PostInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: '12px',
  justifyContent: 'space-between',
});
