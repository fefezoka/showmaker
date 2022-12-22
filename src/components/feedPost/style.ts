import { styled } from '../../style/stitches.config';

export const VideoWrapper = styled('div', {
  overflow: 'hidden',
  width: '100%',
  borderRadius: '2rem',
  cursor: 'pointer',
  paddingBottom: '56.25%',
  position: 'relative',

  video: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    objectFit: 'fill',
  },
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
