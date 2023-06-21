import React, { FormEvent, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { IoSearchSharp, IoCaretDown, IoCaretUp } from 'react-icons/io5';
import { GoSignOut } from 'react-icons/go';
import { useRouter } from 'next/router';
import { useIsDesktop, useScrollDirection } from '@hooks';
import {
  Box,
  Flex,
  Text,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Input,
  ProfileIcon,
  ProviderIcon,
} from '@styles';

export const Header = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const scrollDirection = useScrollDirection();
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
        p: '$3',
        zIndex: '$header',
        bc: '$bg1',
        transition: 'top 400ms',
        ...(scrollDirection === 'down' && !isDesktop ? { top: -64 } : { top: 0 }),

        '@bp2': {
          p: '$3 $5',
        },
      }}
    >
      <Flex justify={'between'} align={'center'} css={{ minWidth: '100%' }}>
        <Flex align={'center'} css={{ flex: 1 }} gap={'3'}>
          {!isDesktop && (
            <Text
              weight={600}
              size={'5'}
              css={{ cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              SM
            </Text>
          )}
          <Box
            css={{ size: '100%', maxWidth: '360px', position: 'relative' }}
            as="form"
            onSubmit={handleFindClick}
          >
            <Input placeholder="Procurar" radius={'2'} />
            <Box css={{ position: 'absolute', right: '$4', top: '$3' }}>
              <Box as={'button'} type="submit">
                <IoSearchSharp color="var(--colors-slate12)" />
              </Box>
            </Box>
          </Box>
        </Flex>

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
                    backgroundColor: '$bg2',
                  },
                }}
              >
                <ProfileIcon src={session.user.image as string} alt="" />
                {isDesktop && (
                  <Text weight={600} size={'4'}>
                    {session.user.name.slice(0, 10)}
                  </Text>
                )}
                {open ? <IoCaretUp /> : <IoCaretDown />}
              </Flex>
            </MenuTrigger>

            <MenuContent>
              {!isDesktop && (
                <>
                  <MenuItem disabled>{session.user.name}</MenuItem>
                  <MenuSeparator />
                </>
              )}
              <MenuSeparator />
              <MenuItem theme={'alert'} onClick={() => signOut()}>
                <GoSignOut />
                Desconectar
              </MenuItem>
            </MenuContent>
          </Menu>
        ) : (
          <Flex
            align={'center'}
            gap={'2'}
            as={'button'}
            css={{ px: '$4', py: '$2', bc: '$bg2', br: '$7', ml: '$3' }}
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
