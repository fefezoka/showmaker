import React from 'react';
import { styled, keyframes } from 'stitches.config';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Flex, overlayStyles } from '@styles';
import { IoClose } from 'react-icons/io5';

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
  p: '$6',
  willChange: 'transform',
  color: '$text-primary',
  bc: '$bg1',
  br: '$3',
  border: '2px solid $bg2',

  '&[data-state="open"]': {
    animation: `${fade} 200ms`,
  },

  '@bp2': {
    width: '400px',
  },
});

type ModalContentProps = DialogPrimitive.DialogContentProps &
  React.ComponentProps<typeof StyledModalContent> & {
    close?: boolean;
  };

export const ModalContent = ({ children, close = true, ...props }: ModalContentProps) => (
  <DialogPrimitive.Portal>
    <ModalOverlay />
    <StyledModalContent {...props}>
      {children}
      {close && (
        <ModalClose asChild>
          <Flex
            as={'button'}
            justify={'center'}
            align={'center'}
            css={{
              position: 'absolute',
              top: -10,
              right: -10,
              size: 48,
              br: '$round',
              bc: '$bg1',
              border: '2px solid $bg2',
            }}
          >
            <IoClose size={24} />
          </Flex>
        </ModalClose>
      )}
    </StyledModalContent>
  </DialogPrimitive.Portal>
);

ModalContent.displayName = 'Modal';

export const ModalClose = DialogPrimitive.Close;
export const ModalTitle = DialogPrimitive.Title;
export const ModalDescription = DialogPrimitive.Description;
