import React, { ReactNode } from 'react';
import { Header } from '../header/Header';
import { Menu } from '../menu/Menu';
import { Container, Main as StyledMain } from './style';

interface Props {
  children: ReactNode;
}

export const Main = ({ children }: Props) => {
  return (
    <StyledMain>
      <Menu />
      <Container>
        <Header />
        {children}
      </Container>
    </StyledMain>
  );
};
