import React from 'react';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';

interface ProviderIcon {
  Icon: IconType;
  bc: string;
  isAlreadyRound?: boolean;
  hasBorder?: boolean;
}

const StyledIcon = styled('div', {
  transition: 'all 300ms ease-in',

  '&:hover': {
    filter: 'brightness(120%) saturate(120%)',
    transform: 'translateY(-4%)',
  },
});

export const ProviderIcon = ({ Icon, bc, isAlreadyRound, hasBorder }: ProviderIcon) => {
  return isAlreadyRound ? (
    <StyledIcon as={Icon} css={{ size: 32, bc, ...(hasBorder && { br: '$round' }) }} />
  ) : (
    <StyledIcon
      css={{
        size: 32,
        bc,
        br: '$round',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon size={18} />
    </StyledIcon>
  );
};
