import React from 'react';
import { CreatePost } from '../createPost/CreatePost';
import { Line, Menu as StyledMenu } from './style';
import { IoHome, IoBookmark, IoPerson } from 'react-icons/io5';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export const Menu = () => {
  const { data: session } = useSession();
  return (
    <StyledMenu>
      <div style={{ position: 'fixed' }}>
        <ul>
          <li>
            <Link href={'/'}>
              <Line active>
                <h3>Show Maker</h3>
              </Line>
            </Link>
          </li>
          <li>
            <Link href={'/'}>
              <Line>
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
            <Link href={session ? `/${session.user.name}` : '#'}>
              <Line>
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
