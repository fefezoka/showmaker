import React from 'react';
import { styled, keyframes } from 'stitches.config';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const HoverCard = HoverCardPrimitive.Root;
export const HoverCardTrigger = HoverCardPrimitive.Trigger;
export const HoverCardArrow = HoverCardPrimitive.Arrow;

export const StyledHoverCardContent = styled(HoverCardPrimitive.Content, {
  bc: '$bg1',
  br: '$3',
  width: '440px',
  zIndex: '$modal',
  border: '2px solid $bg2',
  transition: 'all 200ms ease-out',
  animation: `250ms ${fade}`,
  bs: '0px 0px 16px black',
});

type HoverCardContentProps = HoverCardPrimitive.HoverCardContentProps &
  React.ComponentProps<typeof StyledHoverCardContent>;

export const HoverCardContent = ({ children, ...props }: HoverCardContentProps) => (
  <HoverCardPrimitive.Portal>
    <StyledHoverCardContent {...props}>{children}</StyledHoverCardContent>
  </HoverCardPrimitive.Portal>
);

HoverCardContent.displayName = 'Modal';
