import React from 'react';
import { CreatePost } from '../createPost/CreatePost';
import { Line, Menu as StyledMenu, Row } from './style';
import { IoHome, IoBookmark, IoPerson } from 'react-icons/io5';
import Link from 'next/link';

export const Menu = () => {
  return (
    <StyledMenu>
      <div style={{ position: 'fixed' }}>
        <ul>
          <Row>
            <Link href={'/'}>
              <Line>
                <h3>Show Maker</h3>
              </Line>
            </Link>
          </Row>
          <Row>
            <Link href={'/'}>
              <Line>
                <IoHome />
                <h3>Página inicial</h3>
              </Line>
            </Link>
          </Row>
          <Row>
            <a>
              <Line>
                <IoBookmark />
                <h3>Posts salvos</h3>
              </Line>
            </a>
          </Row>
          <Row>
            <a>
              <Line>
                <IoPerson />
                <h3>Perfil</h3>
              </Line>
            </a>
          </Row>
        </ul>
        <CreatePost />
      </div>
    </StyledMenu>
  );
};
