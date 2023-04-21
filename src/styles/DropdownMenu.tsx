import React from 'react';
import { styled, CSS } from '../../stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

const StyledMenuContent = styled(DropdownMenu.Content, {
  zIndex: '$menu',
  backgroundColor: '$bg-2',
  padding: '$2 0',
  borderRadius: '$2',
  border: '2px solid $bg-3',
});

export const MenuItem = styled(DropdownMenu.Item, {
  color: '$text-primary',
  fontSize: '$3',
  padding: '$2 $4',
  cursor: 'pointer',
  width: '100%',

  '&:hover': {
    outline: 'none',
    backgroundColor: '$bg-3',
  },

  variants: {
    theme: {
      alert: {
        color: '$red-1',
        fontWeight: 600,
      },
    },
  },
});

export const MenuSeparator = styled(DropdownMenu.Separator, {
  height: '2px',
  backgroundColor: '$bg-3',
  margin: '$1 0',
});

const MenuArrow = styled(DropdownMenu.Arrow, {
  fill: '$bg-3',
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
