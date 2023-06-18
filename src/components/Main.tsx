import React, { memo } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { spinner } from '@assets';
import { Box, Flex } from '@styles';
import { Header, Menu } from '@components';

export const Main = memo(
  ({ children, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) => {
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
            <Image src={spinner} alt="" priority loading="eager" height={52} width={52} />
          </div>
        )}
        {status !== 'loading' && (
          <Flex css={{ maxWidth: '960px', m: '0 auto' }} {...props}>
            <Menu />
            <Box
              as={'main'}
              css={{
                width: '100%',

                '& > section': {
                  p: '$4',
                  borderBottom: '1px solid $bg4',
                },

                '& section:first-of-type': {
                  pt: '$4',
                },

                '@bp2': {
                  borderRight: '1px solid $bg4',

                  '& > section': {
                    p: '$5',
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
  }
);

Main.displayName = 'Main';
