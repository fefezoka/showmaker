import { styled } from '../../style/stitches.config';

export const Header = styled('header', {
  position: 'sticky',
  top: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '14px',
  background: '$bg',
  zIndex: '$header',
});

export const Container = styled('div', {
  minWidth: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
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
  div: {
    padding: '8px 0px',
  },
});
