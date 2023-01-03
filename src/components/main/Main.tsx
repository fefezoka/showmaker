import React, { ReactNode, memo } from 'react';
import Image from 'next/image';
import Spinner from '../../assets/Spinner.svg';
import { Header } from '../header/Header';
import { Menu } from '../menu/Menu';
import { Container, Main as StyledMain } from './style';

interface Props {
  children?: ReactNode;
  loading?: boolean;
}

export const Main = memo(({ children, loading }: Props) => {
  return (
    <Container>
      <Menu />
      <StyledMain>
        <Header />
        <>
          {loading && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <Image priority src={Spinner} width={54} height={54} alt="" />
            </div>
          )}
          {children}
        </>
      </StyledMain>
    </Container>
  );
});

Main.displayName = 'Main';
