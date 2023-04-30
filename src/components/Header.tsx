import React, { FormEvent, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { IoSearchSharp, IoCaretDown, IoCaretUp } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { Input, ProfileIcon, ProviderIcon } from '@components';
import { useIsDesktop } from '@hooks';
import {
  Box,
  Flex,
  Heading,
  Text,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@styles';

export const Header = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const handleFindClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.currentTarget[0] as HTMLInputElement).value;

    if (!q) {
      return;
    }

    router.push({
      pathname: '/search',
      query: { q },
    });

    e.currentTarget.reset();
  };

  return (
    <Box
      as={'header'}
      css={{
        position: 'sticky',
        top: 0,
        p: '$3',
        zIndex: '$header',
        bc: '$bg-1',

        '@bp2': {
          p: '$3 $5',
        },
      }}
    >
      <Flex justify={'between'} align={'center'} css={{ minWidth: '100%' }}>
        {!isDesktop && (
          <Box as={'button'} css={{ mr: '$3' }} onClick={() => router.push('/')}>
            <Heading>SM</Heading>
          </Box>
        )}
        <Box
          css={{ size: '100%', maxWidth: '360px', position: 'relative' }}
          as="form"
          onSubmit={(e) => handleFindClick(e)}
        >
          <Input placeholder="Procurar" radius={'2'} />
          <Box css={{ position: 'absolute', right: '$4', top: '$3' }}>
            <Box as={'button'} type="submit">
              <IoSearchSharp color="white" />
            </Box>
          </Box>
        </Box>

        {status === 'authenticated' ? (
          <Menu open={open} onOpenChange={setOpen} modal={false}>
            <MenuTrigger asChild>
              <Flex
                align={'center'}
                gap={'2'}
                css={{
                  br: '$6',
                  ml: '$3',
                  py: '$1',
                  px: '$2',
                  transition: 'all 200ms',
                  cursor: 'pointer',

                  '&:hover': {
                    backgroundColor: '$bg-2',
                  },
                }}
              >
                <ProfileIcon src={session.user.image as string} alt="" />
                {isDesktop && (
                  <Text weight={600} size={'4'}>
                    {session.user.name}
                  </Text>
                )}
                {open ? <IoCaretUp /> : <IoCaretDown />}
              </Flex>
            </MenuTrigger>

            <MenuContent>
              <MenuItem onClick={() => router.push('/')}>Página inicial</MenuItem>
              <MenuItem onClick={() => router.push('/' + session.user.name)}>
                Perfil
              </MenuItem>
              <MenuItem onClick={() => router.push('/config')}>Configurações</MenuItem>
              <MenuSeparator />
              <MenuItem theme={'alert'} onClick={() => signOut()}>
                Sair
              </MenuItem>
            </MenuContent>
          </Menu>
        ) : (
          <Flex
            align={'center'}
            gap={'2'}
            as={'button'}
            css={{ px: '$4', py: '$2', bc: '$bg-2', br: '$7', ml: '$3' }}
            onClick={() => signIn('discord')}
          >
            <ProviderIcon provider="discord" css={{ size: 24, '@bp2': { size: 24 } }} />
            <Text weight={600}>{isDesktop ? 'Logar com Discord' : 'Logar'}</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
