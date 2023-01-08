import React from 'react';
import { IoHome, IoPerson } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { Box } from '../styles';
import { styled } from '../../stitches.config';
const CreatePost = dynamic(() => import('./CreatePost'));

export const Line = styled('div', {
  display: 'flex',
  gap: '16px',
  ai: 'center',
  jc: 'center',
  p: '16px 8px',
  color: '$gray',
  minHeight: '70px',
  transition: 'all 200ms',

  '&:hover': {
    color: '$white',
  },

  '@dsk2': {
    jc: 'left',
    p: '16px',
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
        borderRight: '2px solid $bgalt',
        minWidth: '42px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: '$menu',

        '@dsk2': {
          minWidth: '240px',
        },
      }}
    >
      <Box as={'nav'}>
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
            right: 36,
            bottom: 36,

            '@dsk2': {
              position: 'unset',
              p: '16px',
            },
          }}
        >
          <CreatePost />
        </Box>
      </Box>
    </Box>
  );
};
