import { styled } from '../../style/stitches.config';

export const VideoWrapper = styled('div', {
  overflow: 'hidden',
  width: '100%',
  borderRadius: '2rem',
  cursor: 'pointer',
  paddingBottom: '56.25%',
  position: 'relative',
});

export const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '12px',
});

export const PostInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: '12px',
  justifyContent: 'space-between',
});

export const NewCommentContainer = styled('div', {
  margin: '1rem 0rem 2rem 0rem',
  display: 'flex',
  gap: '1rem',

  input: {
    color: 'white',
    borderRadius: '1rem',
    width: '100%',
    padding: '0px 16px',
    backgroundColor: '$bgalt',
    fontSize: '14px',
  },

  'input::placeholder': {
    color: '$gray',
  },
});

export const CommentContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '.75rem',
});
