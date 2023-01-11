import React, { ReactNode, memo } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { Header, Menu } from './';
import { Box, Flex } from '../styles';

interface Props {
  children?: ReactNode;
  loading?: boolean;
}

export const Main = memo(({ children, loading }: Props) => {
  return (
    <Flex css={{ maxWidth: '1024px', m: '0 auto' }}>
      <Menu />
      <Box
        as={'main'}
        css={{
          borderRight: '2px solid $bgalt',
          width: '100%',

          '& > section': {
            padding: '1rem',
            borderBottom: '2px solid',
            borderColor: '$bgalt',
          },

          '& section:first-of-type': {
            paddingTop: '1rem',
          },

          '@bp2': {
            '& > section': {
              padding: '1.5rem',
            },
          },
        }}
      >
        <Header />
        <>
          {loading && (
            <Box css={{ ta: 'center', width: '100%' }}>
              <Image priority src={Spinner} width={54} height={54} alt="" />
            </Box>
          )}
          {children}
        </>
      </Box>
    </Flex>
  );
});

Main.displayName = 'Main';
