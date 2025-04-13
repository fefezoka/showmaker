import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { IoAddCircle, IoLogoTwitch, IoHelp, IoCheckmarkCircle } from 'react-icons/io5';
import { SiOsu } from 'react-icons/si';
import { NextSeo } from 'next-seo';
import { IconType } from 'react-icons/lib';
import { trpc } from '@/utils/trpc';
import { useTheme } from 'next-themes';
import { lightTheme, theme } from 'stitches.config';
import { Main } from '@/components/main';
import { Box } from '@/styles/box';
import { Heading } from '@/styles/heading';
import { Grid } from '@/styles/grid';
import { LoggedProvider } from '@/components/logged-provider';
import { Text } from '@/styles/text';
import { Flex } from '@/styles/flex';

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
  const { setTheme, resolvedTheme } = useTheme();

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
      <Box as={'section'}>
        <Heading size="2">Temas</Heading>
        <Flex gap={'4'} css={{ mt: '$2' }}>
          <Grid
            columns={'4'}
            css={{
              width: '100%',
              height: 80,
              position: 'relative',
              br: '$3',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            className={theme}
            onClick={() => {
              document.documentElement.classList.replace('light-theme', 'dark-theme');
              document.documentElement.style.setProperty('color-scheme', 'dark');
              setTheme('dark');
            }}
          >
            <Box css={{ bc: theme.colors.bg1.value }} />
            <Box css={{ bc: theme.colors.bg2.value }} />
            <Box css={{ bc: theme.colors.bg3.value }} />
            <Box css={{ bc: theme.colors.bg4.value }} />

            <Box
              css={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Flex align={'center'} gap={'2'}>
                {resolvedTheme === 'dark' ? (
                  <IoCheckmarkCircle size={24} color="var(--colors-blue9)" />
                ) : (
                  <Box
                    css={{
                      bc: theme.colors.bg4.value,
                      size: 22,
                      br: '$round',
                    }}
                  />
                )}
                <Heading>Escuro</Heading>
              </Flex>
            </Box>
          </Grid>
          <Grid
            columns={'4'}
            css={{
              width: '100%',
              height: 80,
              position: 'relative',
              br: '$3',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            className={lightTheme}
            onClick={() => {
              document.documentElement.classList.replace('dark-theme', 'light-theme');
              document.documentElement.style.setProperty('color-scheme', 'light');
              setTheme('light');
            }}
          >
            <Box css={{ bc: lightTheme.colors.bg1.value }} />
            <Box css={{ bc: lightTheme.colors.bg2.value }} />
            <Box css={{ bc: lightTheme.colors.bg3.value }} />
            <Box css={{ bc: lightTheme.colors.bg4.value }} />

            <Box
              css={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Flex align={'center'} gap={'2'}>
                {resolvedTheme === 'light' ? (
                  <IoCheckmarkCircle size={24} color="var(--colors-blue9)" />
                ) : (
                  <Box
                    css={{
                      bc: lightTheme.colors.bg4.value,
                      size: 22,
                      br: '$round',
                    }}
                  />
                )}

                <Heading>Claro</Heading>
              </Flex>
            </Box>
          </Grid>
        </Flex>
      </Box>
    </Main>
  );
}
