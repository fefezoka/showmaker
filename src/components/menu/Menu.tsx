import React from 'react';
import { Line, Menu as StyledMenu } from './style';
import { IoHome, IoBookmark, IoPerson } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
const CreatePost = dynamic(() => import('../createPost/CreatePost'));

interface Props {
  routes: routes;
}

export const Menu = ({ routes }: Props) => {
  const { data: session } = useSession();

  return (
    <StyledMenu>
      <div style={{ position: 'fixed' }}>
        <ul>
          <li>
            <Link href={'/'} prefetch={false}>
              <Line active>
                <h3>Show Maker</h3>
              </Line>
            </Link>
          </li>
          <li>
            <Link href={'/'} prefetch={false}>
              <Line active={routes === 'home'}>
                <IoHome />
                <h3>Página inicial</h3>
              </Line>
            </Link>
          </li>
          <li>
            <a>
              <Line>
                <IoBookmark />
                <h3>Posts salvos</h3>
              </Line>
            </a>
          </li>
          <li>
            <Link href={session ? `/${session.user.name}` : '#'} prefetch={false}>
              <Line active={routes === 'profile'}>
                <IoPerson />
                <h3>Perfil</h3>
              </Line>
            </Link>
          </li>
          <li>
            <Line>
              <CreatePost />
            </Line>
          </li>
        </ul>
      </div>
    </StyledMenu>
  );
};
