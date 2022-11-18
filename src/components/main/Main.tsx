import React, { ReactNode, memo } from 'react';
import { Header } from '../header/Header';
import { Menu } from '../menu/Menu';
import { Container, Main as StyledMain } from './style';

interface Props {
  children?: ReactNode;
  routes?: routes;
}

export const Main = memo(({ children, routes }: Props) => {
  return (
    <Container>
      <Menu routes={routes} />
      <StyledMain>
        <Header />
        {children}
      </StyledMain>
    </Container>
  );
});

Main.displayName = 'Main';
