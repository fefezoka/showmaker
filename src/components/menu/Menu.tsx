import React from 'react';
import { ButtonWrapper, Line, Menu as StyledMenu } from './style';
import { IoHome, IoPerson, IoHeart, IoPeople } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../../hooks/useIsDesktop';
const CreatePost = dynamic(() => import('../createPost/CreatePost'));

export const Menu = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isDesktop = useIsDesktop();

  return (
    <StyledMenu>
      <nav>
        <Link href={'/'} prefetch={false}>
          <Line active>{isDesktop ? <h3>Show Maker</h3> : <h4>SM</h4>}</Line>
        </Link>
        <Link href={'/'} prefetch={false}>
          <Line active={router.pathname === '/'}>
            <IoHome size={20} />
            {isDesktop && <h3>Página inicial</h3>}
          </Line>
        </Link>
        <Link href={session ? `/following` : '#'} prefetch={false}>
          <Line active={router.asPath === `/following`}>
            <IoPeople size={20} />
            {isDesktop && <h3>Seguindo</h3>}
          </Line>
        </Link>
        <Link href={session ? `/${session.user.name}` : '#'} prefetch={false}>
          <Line active={router.asPath === `/${session?.user.name.replace(' ', '%20')}`}>
            <IoPerson size={20} />
            {isDesktop && <h3>Perfil</h3>}
          </Line>
        </Link>
        <ButtonWrapper>
          <CreatePost />
        </ButtonWrapper>
      </nav>
    </StyledMenu>
  );
};
