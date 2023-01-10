import React from 'react';
import { IoHome, IoPerson } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { Box, Flex } from '../styles';
import { styled } from '../../stitches.config';
const CreatePost = dynamic(() => import('./CreatePost'));

export const Line = styled('div', {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 8px',
  color: '$gray',
  minHeight: '40px',
  transition: 'all 200ms',

  '&:hover': {
    color: '$white',
  },

  '@dsk2': {
    minHeight: '70px',
    justifyContent: 'left',
    padding: '16px',
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
        padding: '0px 20px',

        '@dsk2': {
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
        direction={{ '@initial': 'row', '@dsk2': 'column' }}
        justify={{ '@initial': 'between' }}
      >
        <Link href={'/'} prefetch={false}>
          <Line active>{isDesktop ? <h3>Show Maker</h3> : <h4>SM</h4>}</Line>
        </Link>
        <Link href={'/'} prefetch={false}>
          <Line active={router.pathname === '/'}>
            <IoHome size={20} />
            {isDesktop && <h3>Página inicial</h3>}
          </Line>
        </Link>
        <Link href={session ? `/${session.user.name}` : '#'} prefetch={false}>
          <Line active={router.asPath === `/${session?.user.name.replace(' ', '%20')}`}>
            <IoPerson size={20} />
            {isDesktop && <h3>Perfil</h3>}
          </Line>
        </Link>
        <Box
          css={{
            position: 'fixed',
            right: 16,
            bottom: 84,

            '@dsk2': {
              position: 'unset',
              p: '16px',
            },
          }}
        >
          <CreatePost />
        </Box>
      </Flex>
    </Box>
  );
};
