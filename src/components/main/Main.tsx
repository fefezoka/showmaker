import React, { ReactNode, memo } from 'react';
import Image from 'next/image';
import Spinner from '../../assets/Spinner.svg';
import { Header } from '../header/Header';
import { Menu } from '../menu/Menu';
import { Container, Main as StyledMain } from './style';

interface Props {
  children?: ReactNode;
  routes?: routes;
  loading?: boolean;
}

export const Main = memo(({ children, routes, loading }: Props) => {
  return (
    <Container>
      <Menu routes={routes} />
      <StyledMain>
        <Header />
        <>
          {loading && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <Image src={Spinner} width={72} height={72} alt="" />
            </div>
          )}
          {children}
        </>
      </StyledMain>
    </Container>
  );
});

Main.displayName = 'Main';
