import React, { ReactNode, memo } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { Header, Menu } from '.';
import { Box, Flex } from '../styles';
import { useSession } from 'next-auth/react';

interface MainProps {
  children?: ReactNode;
}

export const Main = memo(({ children }: MainProps) => {
  const { status } = useSession();

  return (
    <>
      {status === 'loading' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
          }}
        >
          <h2>Show Maker</h2>
          <Image src={Spinner} alt="" priority loading="eager" height={64} width={64} />
        </div>
      )}
      {status !== 'loading' && (
        <Flex css={{ maxWidth: '960px', m: '0 auto' }}>
          <Menu />
          <Box
            as={'main'}
            css={{
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
                borderRight: '2px solid $bgalt',

                '& > section': {
                  padding: '1.5rem',
                },
              },
            }}
          >
            <Header />
            {children}
          </Box>
        </Flex>
      )}
    </>
  );
});

Main.displayName = 'Main';
