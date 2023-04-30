import React from 'react';
import { IconType } from 'react-icons/lib';
import { styled } from 'stitches.config';
import { SiTwitch, SiOsu } from 'react-icons/si';
import { FaDiscord } from 'react-icons/fa';
import { Flex } from '@styles';

type Providers = 'discord' | 'twitch' | 'osu';

interface IProviderIcon extends React.ComponentProps<typeof StyledIcon> {
  provider: Providers;
}

interface IOptions {
  icon: IconType;
  bc: string;
  isAlreadyRound?: boolean;
  hasBorder?: boolean;
  sizeWrapperRatio: number;
}

const options: Record<Providers, IOptions> = {
  discord: {
    bc: '$discord',
    icon: FaDiscord,
    sizeWrapperRatio: 16 / 24,
  },
  osu: {
    bc: '$osu',
    icon: SiOsu,
    hasBorder: true,
    isAlreadyRound: true,
    sizeWrapperRatio: 14 / 24,
  },
  twitch: {
    bc: '$twitch',
    icon: SiTwitch,
    sizeWrapperRatio: 14 / 24,
  },
};

const StyledIcon = styled('div', {
  transition: 'all 300ms ease-in',

  '&:hover': {
    filter: 'brightness(120%) saturate(120%)',
    transform: 'translateY(-4%)',
  },
});

export const ProviderIcon = ({ provider, css, ...props }: IProviderIcon) => {
  return options[provider].isAlreadyRound ? (
    <StyledIcon
      as={options[provider].icon}
      css={{
        size: 24,
        bc: options[provider].bc,
        ...(options[provider].hasBorder && { br: '$round' }),
        '@bp2': {
          size: 32,
        },
        ...css,
      }}
    />
  ) : (
    <StyledIcon
      {...props}
      css={{
        size: 24,
        bc: options[provider].bc,
        br: '$round',
        display: 'flex',
        jc: 'center',
        ai: 'center',

        '@bp2': {
          size: 32,
        },
        ...css,
      }}
    >
      <Flex
        as={options[provider].icon}
        css={{ size: Number(css?.size || 32) * options[provider].sizeWrapperRatio }}
      />
    </StyledIcon>
  );
};
