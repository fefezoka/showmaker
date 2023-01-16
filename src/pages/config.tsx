import React from 'react';
import { GetServerSideProps } from 'next';
import { Account } from 'next-auth/';
import { getSession, signIn } from 'next-auth/react';
import { Main, TitleAndMetaTags } from '../components';
import { prisma } from '../lib/prisma';
import { Box, Grid, Heading } from '../styles';
import { IoRemoveCircle, IoAddCircle } from 'react-icons/io5';
import { styled } from '../../stitches.config';
import osuIcon from '../assets/osu-icon.png';
import Image, { StaticImageData } from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

type providers = 'osu';

const providers: { name: providers; logo: StaticImageData }[] = [
  {
    name: 'osu',
    logo: osuIcon,
  },
];

interface Props {
  accounts: (Account & { id: string })[];
  noConnectionProviders: typeof providers;
}

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

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      provider: true,
      providerAccountId: true,
    },
    where: {
      provider: {
        not: 'discord',
      },
      userId: session.user.id,
    },
  });

  const noConnectionProviders = providers.filter(
    (provider) => !accounts.some((account) => provider.name === account.provider)
  );

  return {
    props: {
      accounts: accounts,
      noConnectionProviders: noConnectionProviders,
    },
  };
};

const ProviderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  br: '$1',
  transition: 'all 200ms',
  padding: '$3 $4',

  variants: {
    provider: {
      osu: {
        backgroundColor: '#e4649d',

        '&:hover': {
          backgroundColor: '#d65a91',
        },
      },
    },
  },
});

export default function Config({ accounts, noConnectionProviders }: Props) {
  const router = useRouter();

  const handleDisconnectAccount = async (accountId: string) => {
    await axios.post('/api/user/disconnectAccount', {
      accountId: accountId,
    });

    router.reload();
  };

  return (
    <>
      <TitleAndMetaTags title="Configurações" />
      <Main>
        <Box as={'section'}>
          <Heading size="2">Configurações</Heading>
        </Box>
        <Box as={'section'}>
          <Heading size="2">Contas</Heading>
          {accounts.length !== 0 && (
            <Box css={{ mt: '$2' }}>
              <Heading>Contas conectadas</Heading>
              <Grid
                columns={{ '@initial': '1', '@bp2': '2' }}
                gap={'4'}
                css={{ mt: '$2' }}
              >
                {accounts.map((account) => (
                  <ProviderContainer
                    key={account.provider}
                    provider={account.provider as providers}
                  >
                    <Image
                      src={
                        providers.find((provider) => provider.name === account.provider)
                          ?.logo ?? osuIcon
                      }
                      alt=""
                      height={44}
                      width={44}
                    />
                    <Heading>{account.provider}</Heading>
                    <button
                      type="button"
                      onClick={() => handleDisconnectAccount(account.id)}
                    >
                      <IoRemoveCircle size={24} />
                    </button>
                  </ProviderContainer>
                ))}
              </Grid>
            </Box>
          )}

          {noConnectionProviders.length !== 0 && (
            <Box css={{ mt: '$2' }}>
              <Heading>Conectar</Heading>
              <Grid
                columns={{ '@initial': '1', '@bp2': '2' }}
                gap={'4'}
                css={{ mt: '$2' }}
              >
                {noConnectionProviders.map((provider) => (
                  <ProviderContainer
                    key={provider.name}
                    provider={provider.name as providers}
                  >
                    <Image
                      src={
                        providers.find((provider) => provider.name === provider.name)
                          ?.logo ?? osuIcon
                      }
                      alt=""
                      height={44}
                      width={44}
                    />
                    <Heading>{provider.name}</Heading>
                    <button type="button" onClick={() => signIn(provider.name)}>
                      <IoAddCircle size={24} />
                    </button>
                  </ProviderContainer>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Main>
    </>
  );
}
