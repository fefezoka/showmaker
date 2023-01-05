import { styled } from '../styles/stitches.config';

export const ProfileContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '16px',
  alignItems: 'center',
});

export const FollowSpan = styled('span', {
  fontSize: '14px',
});

export const FeedButtonWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '16px',
});

export const FeedButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  fontSize: '.875rem',
  padding: '14px 20px',
  borderRadius: '8px',
  transition: 'all 200ms',
  color: '$white',

  '&:hover': {
    backgroundColor: '$bgalt',
  },

  '@dsk2': {
    fontSize: '1rem',
  },

  variants: {
    active: {
      true: {
        fontWeight: 'bold',
      },
    },
  },
});
