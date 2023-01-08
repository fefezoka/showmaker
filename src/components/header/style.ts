import { styled } from '../../styles/stitches.config';
import { Content, Item, Separator, Arrow } from '@radix-ui/react-dropdown-menu';

export const Header = styled('header', {
  position: 'sticky',
  top: 0,
  padding: '14px 16px',
  background: '$bg',
  zIndex: '$header',

  '@dsk2': {
    padding: '14px 24px',
  },
});

export const Container = styled('div', {
  minWidth: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const UserContainer = styled('div', {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  borderRadius: '24px',
  marginLeft: '12px',
  padding: '4px 6px',
  transition: 'all 200ms',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '$bgalt',
  },
});

export const Input = styled('input', {
  width: '100%',
  padding: '14px 18px',
  border: 'none',
  borderRadius: '2rem',
  fontSize: '.875rem',
  backgroundColor: '$bgalt',
  color: '$white',

  '&::placeholder': {
    color: '$gray',
    fontWeight: 700,
  },
});

export const UserSettingsModal = styled(Content, {
  zIndex: '$modal',
  backgroundColor: '$white',
  minWidth: '130px',
  padding: '6px',
  borderRadius: '8px',
});

export const StyledItem = styled(Item, {
  display: 'flex',
  justifyContent: 'center',
  color: '$black',
  fontSize: '.875rem',
  borderRadius: '4px',
  padding: '6px',
  fontWeight: 400,
  cursor: 'pointer',

  '&:hover': {
    outline: 'none',
    backgroundColor: '$bgalt',
    color: '$white',
  },
});

export const StyledSeparator = styled(Separator, {
  height: '1px',
  backgroundColor: '$gray',
  margin: '4px',
});

export const StyledArrow = styled(Arrow, {
  fill: '$white',
});
