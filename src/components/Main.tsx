import React, { ReactNode, memo } from 'react';
import Image from 'next/image';
import Spinner from '../assets/Spinner.svg';
import { Header, Menu } from '@components';
import { Box, Flex } from '@styles';
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
                padding: '$4',
                borderBottom: '2px solid',
                borderColor: '$bg-2',
              },

              '& section:first-of-type': {
                paddingTop: '$4',
              },

              '@bp2': {
                borderRight: '2px solid $bg-2',

                '& > section': {
                  padding: '$5',
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
