import React from 'react';
import { styled, CSS } from '../../stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

const StyledMenuContent = styled(DropdownMenu.Content, {
  zIndex: '$modal',
  backgroundColor: '$white',
  minWidth: '130px',
  padding: '$1',
  borderRadius: '$2',
});

export const MenuItem = styled(DropdownMenu.Item, {
  display: 'flex',
  justifyContent: 'center',
  color: '$black',
  fontSize: '$3',
  borderRadius: '$1',
  padding: '$2',
  cursor: 'pointer',
  zIndex: '$modal',
  '&:hover': {
    outline: 'none',
    backgroundColor: '$bgalt',
    color: '$white',
  },
});

export const MenuSeparator = styled(DropdownMenu.Separator, {
  height: '1px',
  backgroundColor: '$gray',
  margin: '$1',
});

const MenuArrow = styled(DropdownMenu.Arrow, {
  fill: '$white',
});

type MenuContentPrimitiveProps = React.ComponentProps<typeof DropdownMenu.Content>;
type MenuContentProps = MenuContentPrimitiveProps & { css?: CSS };

export const MenuContent = React.forwardRef<
  React.ElementRef<typeof StyledMenuContent>,
  MenuContentProps
>(({ children, ...props }, forwardedRef) => (
  <DropdownMenu.Portal>
    <StyledMenuContent {...props} ref={forwardedRef}>
      {children}
      <MenuArrow />
    </StyledMenuContent>
  </DropdownMenu.Portal>
));

MenuContent.displayName = 'Menu';
