import React from 'react';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';

interface IProviderIcon {
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

export const ProviderIcon = ({ Icon, bc, isAlreadyRound, hasBorder }: IProviderIcon) => {
  return isAlreadyRound ? (
    <StyledIcon
      as={Icon}
      css={{
        size: 24,
        bc,
        ...(hasBorder && { br: '$round' }),
        '@bp2': {
          size: 32,
        },
      }}
    />
  ) : (
    <StyledIcon
      css={{
        size: 24,
        bc,
        br: '$round',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '@bp2': {
          size: 32,
        },
      }}
    >
      <Icon size={18} />
    </StyledIcon>
  );
};
