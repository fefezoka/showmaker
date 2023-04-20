import React from 'react';
import { styled, CSS, keyframes } from '../../stitches.config';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { overlayStyles } from './Overlay';

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
  color: '$black-1',
  backgroundColor: '$modal',
  borderRadius: '$2',

  '&[data-state="open"]': {
    animation: `${fade} 200ms`,
  },

  '@bp2': {
    width: '400px',
  },
});

type ModalContentPrimitiveProps = React.ComponentProps<typeof DialogPrimitive.Content>;
type ModalContentProps = ModalContentPrimitiveProps & { css?: CSS };

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof StyledModalContent>,
  ModalContentProps
>(({ children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <StyledModalContent {...props} ref={forwardedRef}>
      {children}
    </StyledModalContent>
  </DialogPrimitive.Portal>
));

ModalContent.displayName = 'Modal';

export const ModalClose = DialogPrimitive.Close;
export const ModalTitle = DialogPrimitive.Title;
export const ModalDescription = DialogPrimitive.Description;
