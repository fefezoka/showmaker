import React from 'react';
import { IoHome, IoPerson } from 'react-icons/io5';
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
  color: '$text-secondary',
  minHeight: '$8',
  transition: 'color 200ms',

  h1: {
    transition: 'color 200ms',
    color: '$text-secondary',
  },

  '&:hover': {
    color: '$text-primary',

    h1: {
      color: '$text-primary',
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
        color: '$text-primary',

        h1: {
          color: '$text-primary',
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
        borderTop: '2px solid $bg2',

        '@bp2': {
          borderTop: 'unset',
          borderRight: '2px solid $bg2',
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
        <Box
          css={{
            p: '$4',
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
