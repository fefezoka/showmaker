import { styled } from '../../style/stitches.config';

export const Header = styled('header', {
  position: 'sticky',
  top: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '18px 16px',
  background: '$bg',
  zIndex: '$header',

  '@dsk2': {
    padding: '18px 24px',
  },
});

export const Container = styled('div', {
  minWidth: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  ul: {
    display: 'flex',
    gap: '16px',
  },
});

export const UserSettings = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  alignItems: 'center',
  marginLeft: '12px',
  flexShrink: '0',
});

export const Input = styled('input', {
  width: '100%',
  padding: '10px 18px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '.875rem',
  backgroundColor: '$bgalt',
  color: '$white',

  '&::placeholder': {
    color: '$gray',
    fontWeight: 700,
  },
});
