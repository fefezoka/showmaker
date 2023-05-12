import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { IoAddCircle, IoLogoTwitch, IoHelp } from 'react-icons/io5';
import { SiOsu } from 'react-icons/si';
import { NextSeo } from 'next-seo';
import { IconType } from 'react-icons/lib';
import { trpc } from '@utils';
import { LoggedProvider, Main } from '@components';
import { Box, Flex, Grid, Heading, Text } from '@styles';

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
  const { data: accounts, isLoading } = trpc.auth.accounts.useQuery();

  if (isLoading) {
    return <Main />;
  }

  return (
    <Main>
      <NextSeo title="Show Maker // Configurações" />
      <Box as={'section'}>
        <Heading size="2">Configurações</Heading>
      </Box>
      <Box as={'section'}>
        {accounts && accounts.length !== 0 && (
          <Box>
            <Heading size="2">Contas</Heading>
            <Box css={{ mt: '$2' }}>
              <Grid
                columns={{ '@initial': '1', '@bp2': '2' }}
                gap={'4'}
                css={{ mt: '$2' }}
              >
                {accounts.map((account, index) => (
                  <LoggedProvider
                    key={index}
                    account={account}
                    provider={
                      providers.find(
                        (provider) => provider.name === account.provider
                      ) || {
                        name: account.provider,
                        bc: '$bg2',
                        logo: IoHelp,
                      }
                    }
                  />
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {!accounts ||
          (accounts.length !== providers.length && (
            <Box css={{ mt: '$4' }}>
              <Text weight={600}>Logar</Text>
              <Flex css={{ mt: '$2' }} gap={'4'}>
                {providers
                  .filter(
                    (provider) =>
                      !accounts.some((account) => account.provider === provider.name)
                  )
                  .map((provider, index) => (
                    <Flex
                      align={'center'}
                      justify={'between'}
                      key={index}
                      css={{
                        borderRadius: '$2',
                        p: '$4 $3',
                        bc: provider.bc,
                        width: '192px',
                      }}
                    >
                      <provider.logo size={28} />
                      <Text weight={600}>
                        {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
                      </Text>
                      <Flex as={'button'} onClick={() => signIn(provider.name)}>
                        <Flex
                          as={IoAddCircle}
                          css={{ size: 20, color: '$text-primary' }}
                        />
                      </Flex>
                    </Flex>
                  ))}
              </Flex>
            </Box>
          ))}
      </Box>
    </Main>
  );
}
