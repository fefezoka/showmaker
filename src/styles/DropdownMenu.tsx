import React from 'react';
import { styled, CSS } from '../../stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

const StyledMenuContent = styled(DropdownMenu.Content, {
  zIndex: '$menu',
  backgroundColor: '$white-1',
  minWidth: '130px',
  padding: '$1',
  borderRadius: '$2',
});

export const MenuItem = styled(DropdownMenu.Item, {
  display: 'flex',
  justifyContent: 'center',
  color: '$text-black-primary',
  fontSize: '$3',
  borderRadius: '$1',
  padding: '$2',
  cursor: 'pointer',

  '&:hover': {
    outline: 'none',
    fontWeight: 600,
  },
});

export const MenuSeparator = styled(DropdownMenu.Separator, {
  height: '1px',
  backgroundColor: '$gray-1',
  margin: '$1',
});

const MenuArrow = styled(DropdownMenu.Arrow, {
  fill: '$white-1',
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
