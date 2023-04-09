import React, { FormEvent, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ProfileIcon } from '.';
import { IoSearchSharp, IoCaretDown, IoCaretUp } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../hooks/useIsDesktop';
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
} from '../styles';
import { styled } from '../../stitches.config';

export const Input = styled('input', {
  width: '100%',
  padding: '$3 $5',
  border: 'none',
  borderRadius: '$7',
  fontSize: '$3',
  backgroundColor: '$bgalt',
  color: '$white',

  '&::placeholder': {
    color: '$gray',
    fontWeight: 700,
  },
});

export const Header = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const handleFindClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push({
      pathname: '/search',
      query: { q: (e.currentTarget[0] as HTMLInputElement).value },
    });
  };

  return (
    <Box
      as={'header'}
      css={{
        position: 'sticky',
        top: 0,
        p: '$3',
        zIndex: '$header',
        bc: '$bg',

        '@bp2': {
          p: '$3 $6',
        },
      }}
    >
      <Flex justify={'between'} align={'center'} css={{ minWidth: '100%' }}>
        {!isDesktop && (
          <Box as={'button'} css={{ mr: '$3' }} onClick={() => router.push('/')}>
            <Heading>SM</Heading>
          </Box>
        )}
        <Box css={{ size: '100%', position: 'relative', maxWidth: '360px' }}>
          <Box as="form" onSubmit={(e) => handleFindClick(e)}>
            <Input placeholder="Procurar" />
            <Box css={{ position: 'absolute', right: '$4', top: '$3' }}>
              <Box as={'button'} type="submit">
                <IoSearchSharp color="white" />
              </Box>
            </Box>
          </Box>
        </Box>

        {status === 'authenticated' ? (
          <Menu open={open} onOpenChange={setOpen} modal={false}>
            <MenuTrigger asChild>
              <Flex
                align={'center'}
                gap={'3'}
                css={{
                  br: '$6',
                  ml: '$3',
                  py: '$1',
                  px: '$2',
                  transition: 'all 200ms',
                  cursor: 'pointer',

                  '&:hover': {
                    backgroundColor: '$bgalt',
                  },
                }}
              >
                <ProfileIcon src={session?.user?.image as string} alt="" />
                {isDesktop && <Text weight={'bold'}>{session?.user?.name}</Text>}
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
              <MenuItem onClick={() => signOut()}>Sair</MenuItem>
            </MenuContent>
          </Menu>
        ) : (
          <Box css={{ ta: 'right' }}>
            <Box as={'button'} onClick={() => signIn('discord')}>
              <Text weight={'bold'}>Logar com Discord</Text>
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
