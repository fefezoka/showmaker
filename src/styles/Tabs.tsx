import React from 'react';
import { styled } from '../../stitches.config';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const Tabs = TabsPrimitive.Root;
export const TabsTrigger = TabsPrimitive.Trigger;
export const TabsList = TabsPrimitive.List;

export const StyledTabsContent = styled(TabsPrimitive.Content, {
  width: '100%',
  height: '400px',
  overflowY: 'scroll',

  '&::-webkit-scrollbar-thumb': {
    br: '$4',
  },
  '&::-webkit-scrollbar': {
    width: '$2',
  },
});

type TabsContentProps = TabsPrimitive.TabsContentProps &
  React.ComponentProps<typeof StyledTabsContent>;

export const TabsContent = ({ children, ...props }: TabsContentProps) => (
  <StyledTabsContent {...props}>{children}</StyledTabsContent>
);

TabsContent.displayName = 'Tabs';
