import React from 'react';
import { styled, keyframes } from 'stitches.config';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { overlayStyles } from '@styles';

const fade = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;

export const ModalOverlay = styled(DialogPrimitive.Overlay, overlayStyles, {
  '&[data-state="open"]': {
    animation: `${fade} 200ms`,
  },
});

export const StyledModalContent = styled(DialogPrimitive.Content, {
  position: 'fixed',
  top: '50%',
  left: '50%',
  zIndex: '$modal',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 40px)',
  padding: '$6',
  willChange: 'transform',
  color: '$text-primary',
  backgroundColor: '$bg-1',
  borderRadius: '$3',
  border: '2px solid $bg-2',

  '&[data-state="open"]': {
    animation: `${fade} 200ms`,
  },

  '@bp2': {
    width: '400px',
  },
});

type ModalContentProps = DialogPrimitive.DialogContentProps &
  React.ComponentProps<typeof StyledModalContent>;

export const ModalContent = ({ children, ...props }: ModalContentProps) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <StyledModalContent {...props}>{children}</StyledModalContent>
  </DialogPrimitive.Portal>
);

ModalContent.displayName = 'Modal';

export const ModalClose = DialogPrimitive.Close;
export const ModalTitle = DialogPrimitive.Title;
export const ModalDescription = DialogPrimitive.Description;
