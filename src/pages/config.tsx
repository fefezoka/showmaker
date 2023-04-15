import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { IoRemoveCircle, IoAddCircle, IoLogoTwitch } from 'react-icons/io5';
import { SiOsu } from 'react-icons/si';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { trpc } from '../utils/trpc';
import { Main } from '@components';
import { Box, Flex, Grid, Heading, Text } from '@styles';
import { IconType } from 'react-icons/lib';

type providers = 'osu' | 'twitch';

const providers: { name: providers; logo: IconType; bc: string }[] = [
  {
    name: 'osu',
    logo: SiOsu,
    bc: '$osu',
  },
  {
    name: 'twitch',
    logo: IoLogoTwitch,
    bc: '$twitch',
  },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession({ ctx: ctx });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Config() {
  const router = useRouter();
  const disconnectAccount = trpc.auth.disconnectAccount.useMutation();
  const { data: accounts } = trpc.auth.accounts.useQuery();

  if (!accounts) {
    return <></>;
  }

  const handleConnectDisconnectAccount = async (provider: string) => {
    accounts.some((account) => account.provider === provider)
      ? await disconnectAccount.mutateAsync({ provider })
      : signIn(provider);

    router.reload();
  };

  return (
    <>
      <NextSeo title="Show Maker // Configurações" />
      <Main>
        <Box as={'section'}>
          <Heading size="2">Configurações</Heading>
        </Box>
        <Box as={'section'}>
          <Heading size="2">Contas</Heading>
          <Box css={{ mt: '$2' }}>
            <Grid columns={{ '@initial': '1', '@bp2': '2' }} gap={'4'} css={{ mt: '$2' }}>
              {providers.map((provider) => (
                <Flex
                  justify={'between'}
                  align={'center'}
                  css={{
                    br: '$1',
                    transition: 'all 200ms',
                    ...(accounts.some((account) => account.provider === provider.name)
                      ? { bc: '$bgalt' }
                      : { bc: provider.bc }),
                  }}
                  key={provider.name}
                >
                  <Flex
                    align={'center'}
                    justify={'center'}
                    css={{
                      br: '$1',
                      height: 72,
                      width: 72,
                      bc: provider.bc,
                    }}
                  >
                    <provider.logo size={32} />
                  </Flex>
                  <Box css={{ ta: 'center' }}>
                    <Heading css={{ lh: 'unset' }}>
                      {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
                    </Heading>
                    <Text size={'3'} css={{ color: '$input-gray' }}>
                      {
                        accounts.find((account) => account.provider === provider.name)
                          ?.providerAccountId
                      }
                    </Text>
                  </Box>
                  <Box
                    as="button"
                    type="button"
                    css={{ mr: '$4' }}
                    onClick={() => handleConnectDisconnectAccount(provider.name)}
                  >
                    {accounts.some((account) => account.provider === provider.name) ? (
                      <IoRemoveCircle size={24} />
                    ) : (
                      <IoAddCircle size={24} />
                    )}
                  </Box>
                </Flex>
              ))}
            </Grid>
          </Box>
        </Box>
      </Main>
    </>
  );
}
