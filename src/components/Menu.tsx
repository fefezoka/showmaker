import React from 'react';
import { IoHome, IoPerson } from 'react-icons/io5';
import { BsGearFill } from 'react-icons/bs';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { styled } from 'stitches.config';
import { CreatePost } from '@components';
import { Box, Flex, Heading } from '@styles';
import { useIsDesktop } from '@hooks';

export const Line = styled('div', {
  display: 'flex',
  gap: '$4',
  ai: 'center',
  jc: 'center',
  p: '$4 $2',
  color: '$slate11',
  minHeight: '$8',
  transition: 'color 200ms',

  h1: {
    transition: 'color 200ms',
    color: '$slate11',
  },

  '&:hover': {
    color: '$slate12',

    h1: {
      color: '$slate12',
    },
  },

  '@bp2': {
    minHeight: '64px',
    jc: 'left',
    p: '$4',
  },

  variants: {
    active: {
      true: {
        color: '$slate12',

        h1: {
          color: '$slate12',
        },
      },
    },
  },
});

export const Menu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  return isDesktop ? (
    <Box
      as={'aside'}
      css={{
        position: 'fixed',
        bc: '$bg1',
        bottom: 0,
        minWidth: '100vw',
        zIndex: '$menu',
        p: '0 $5',
        borderTop: '1px solid $bg4',

        '@bp2': {
          borderTop: 'unset',
          borderRight: '1px solid $bg4',
          position: 'sticky',
          top: 0,
          height: '100vh',
          minWidth: '240px',
          p: 0,
        },
      }}
    >
      <Flex
        as={'nav'}
        direction={{ '@initial': 'row', '@bp2': 'column' }}
        justify={{ '@initial': 'between' }}
      >
        <Link href={'/'} prefetch={false}>
          <Line active>
            {isDesktop ? <Heading size="2">Show Maker</Heading> : <Heading>SM</Heading>}
          </Line>
        </Link>
        <Link href={'/'} prefetch={false}>
          <Line active={router.pathname === '/'}>
            <IoHome size={20} />
            {isDesktop && <Heading size="2">Página inicial</Heading>}
          </Line>
        </Link>
        <Link href={session ? `/${session.user.name}` : '#'} prefetch={false}>
          <Line active={router.asPath === `/${session?.user.name.replace(' ', '%20')}`}>
            <IoPerson size={20} />
            {isDesktop && <Heading size="2">Perfil</Heading>}
          </Line>
        </Link>
        <Link href={session ? `/config` : '#'} prefetch={false}>
          <Line active={router.asPath === `/config`}>
            <BsGearFill size={20} />
            {isDesktop && <Heading size="2">Configurações</Heading>}
          </Line>
        </Link>
        <Box
          css={{
            p: '$2 $7 $4 0',
          }}
        >
          <CreatePost />
        </Box>
      </Flex>
    </Box>
  ) : (
    <></>
  );
};
