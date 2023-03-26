import React from 'react';
import { IoHome, IoPerson } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../hooks';
import { Box, Flex, Heading } from '../styles';
import { styled } from '../../stitches.config';
const CreatePost = dynamic(() => import('./CreatePost'));

export const Line = styled('div', {
  display: 'flex',
  gap: '$4',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$4 $2',
  color: '$gray',
  minHeight: '40px',
  transition: 'all 200ms',

  '&:hover': {
    color: '$white',
  },

  '@bp2': {
    minHeight: '64px',
    justifyContent: 'left',
    padding: '$4',
  },

  variants: {
    active: {
      true: {
        color: '$white',
      },
    },
  },
});

export const Menu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  return (
    <Box
      as={'aside'}
      css={{
        position: 'fixed',
        backgroundColor: '$bg',
        bottom: 0,
        minWidth: '100vw',
        zIndex: '$menu',
        padding: '0 $5',
        borderTop: '2px solid $bgalt',

        '@bp2': {
          borderTop: 'unset',
          borderRight: '2px solid $bgalt',
          position: 'sticky',
          top: 0,
          height: '100vh',
          minWidth: '240px',
          padding: 0,
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
            {isDesktop ? <Heading>Show Maker</Heading> : <Heading>SM</Heading>}
          </Line>
        </Link>
        <Link href={'/'} prefetch={false}>
          <Line active={router.pathname === '/'}>
            <IoHome size={20} />
            {isDesktop && <Heading>Página inicial</Heading>}
          </Line>
        </Link>
        <Link href={session ? `/${session.user.name}` : '#'} prefetch={false}>
          <Line active={router.asPath === `/${session?.user.name.replace(' ', '%20')}`}>
            <IoPerson size={20} />
            {isDesktop && <Heading>Perfil</Heading>}
          </Line>
        </Link>
        <Box
          css={{
            position: 'fixed',
            right: 16,
            bottom: 84,

            '@bp2': {
              position: 'unset',
              p: '$4',
            },
          }}
        >
          <CreatePost />
        </Box>
      </Flex>
    </Box>
  );
};
