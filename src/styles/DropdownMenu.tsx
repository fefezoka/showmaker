import React from 'react';
import { styled } from 'stitches.config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

const StyledMenuContent = styled(DropdownMenu.Content, {
  zIndex: '$menu',
  backgroundColor: '$bg2',
  padding: '$2 0',
  borderRadius: '$2',
  border: '1px solid $bg4',
  minWidth: 0,
});

export const MenuItem = styled(DropdownMenu.Item, {
  color: '$slate12',
  fontSize: '$3',
  padding: '$2 $4',
  cursor: 'pointer',
  width: '100%',

  '&:hover': {
    outline: 'none',
    backgroundColor: '$bg3',
  },

  '&[data-disabled]': {
    fontWeight: 600,
  },

  variants: {
    theme: {
      alert: {
        color: '$red9',
        fontWeight: 600,
      },
    },
  },
});

export const MenuSeparator = styled(DropdownMenu.Separator, {
  height: '2px',
  backgroundColor: '$bg3',
});

export const MenuArrow = styled(DropdownMenu.Arrow, {
  fill: '$bg4',
});

type MenuContentProps = DropdownMenu.DropdownMenuProps &
  React.ComponentProps<typeof StyledMenuContent>;

export const MenuContent = ({ children, ...props }: MenuContentProps) => (
  <DropdownMenu.Portal>
    <StyledMenuContent {...props}>
      {children}
      <MenuArrow />
    </StyledMenuContent>
  </DropdownMenu.Portal>
);

MenuContent.displayName = 'Menu';
