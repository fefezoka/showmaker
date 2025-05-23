import React from 'react';
import { useRouter } from 'next/router';
import { IoRemoveCircle } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import { Flex } from '@/styles/flex';
import { Box } from '@/styles/box';
import { Heading } from '@/styles/heading';
import { Text } from '@/styles/text';
import { trpc } from '@/utils/trpc';

interface ILoggedProvider {
  account: {
    id: string;
    provider: string;
    providerAccountId: string;
  };
  provider: {
    bc: string;
    name: string;
    logo: IconType;
  };
}

export const LoggedProvider = ({ provider, account }: ILoggedProvider) => {
  const router = useRouter();
  const disconnectAccount = trpc.auth.disconnectAccount.useMutation();

  const handleDisconnectAccount = async (provider: string) => {
    await disconnectAccount.mutateAsync({ provider });
    router.reload();
  };

  return (
    <Flex
      justify={'between'}
      align={'center'}
      css={{
        br: '$2',
        transition: 'all 200ms',
        bc: '$bg3',
        overflow: 'hidden',
      }}
      key={provider.name}
    >
      <Flex
        align={'center'}
        justify={'center'}
        css={{
          height: 80,
          width: 80,
          bc: provider.bc,
        }}
      >
        <provider.logo size={32} color="white" />
      </Flex>
      <Box css={{ ta: 'center' }}>
        <Heading css={{ lh: 'unset' }}>
          {provider.name.charAt(0).toUpperCase() + provider.name.slice(1)}
        </Heading>
        <Text color={'gray'}>Logado como </Text>
        <Text color={'gray'} weight={600}>
          {account.providerAccountId}
        </Text>
      </Box>
      <Box
        as="button"
        type="button"
        css={{ mr: '$4' }}
        onClick={() => handleDisconnectAccount(provider.name)}
      >
        <Box as={IoRemoveCircle} size={24} />
      </Box>
    </Flex>
  );
};
