import React, { FormEvent, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ProfileIcon } from './';
import { IoSearchSharp, IoCaretDown, IoCaretUp } from 'react-icons/io5';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../hooks/useIsDesktop';
import { Box, Flex } from '../styles';
import { styled } from '../../stitches.config';

export const Input = styled('input', {
  width: '100%',
  padding: '14px 18px',
  border: 'none',
  borderRadius: '2rem',
  fontSize: '.875rem',
  backgroundColor: '$bgalt',
  color: '$white',

  '&::placeholder': {
    color: '$gray',
    fontWeight: 700,
  },
});

export const UserSettingsModal = styled(DropdownMenu.Content, {
  zIndex: '$modal',
  backgroundColor: '$white',
  minWidth: '130px',
  padding: '6px',
  borderRadius: '8px',
});

export const StyledItem = styled(DropdownMenu.Item, {
  display: 'flex',
  justifyContent: 'center',
  color: '$black',
  fontSize: '.875rem',
  borderRadius: '4px',
  padding: '6px',
  fontWeight: 400,
  cursor: 'pointer',

  '&:hover': {
    outline: 'none',
    backgroundColor: '$bgalt',
    color: '$white',
  },
});

export const StyledSeparator = styled(DropdownMenu.Separator, {
  height: '1px',
  backgroundColor: '$gray',
  margin: '4px',
});

export const StyledArrow = styled(DropdownMenu.Arrow, {
  fill: '$white',
});

export const Header = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const findRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const handleFindClick = (e: FormEvent) => {
    e.preventDefault();
    if (findRef?.current?.value) {
      router.push(`/search/${findRef.current.value}`);
    }
  };

  return (
    <Box
      as={'header'}
      css={{
        position: 'sticky',
        top: 0,
        p: '14px 16px',
        zIndex: '$header',
        bc: '$bg',

        '@dsk2': {
          p: '14px 24px',
        },
      }}
    >
      <Flex justify={'between'} align={'center'} css={{ minWidth: '100%' }}>
        <Box css={{ size: '100%', position: 'relative', maxWidth: '360px' }}>
          <form onSubmit={(e) => handleFindClick(e)}>
            <Input ref={findRef} placeholder="Procurar" />
            <Box css={{ position: 'absolute', right: 18, top: 14 }}>
              <button type="submit">
                <IoSearchSharp color="white" />
              </button>
            </Box>
          </form>
        </Box>

        {status === 'authenticated' ? (
          <DropdownMenu.Root open={open ? true : false} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <Flex
                align={'center'}
                gap={'3'}
                css={{
                  br: '24px',
                  ml: '$3',
                  py: '$1',
                  px: '6px',
                  transition: 'all 200ms',
                  cursor: 'pointer',

                  '&:hover': {
                    backgroundColor: '$bgalt',
                  },
                }}
                onClick={() => router.push(`/${session.user.name}`)}
              >
                <ProfileIcon src={session?.user?.image as string} alt="" />
                {isDesktop && <h4>{session?.user?.name}</h4>}
                {open ? <IoCaretUp /> : <IoCaretDown />}
              </Flex>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <UserSettingsModal>
                <StyledItem onClick={() => router.push('/')}>Página inicial</StyledItem>
                <StyledItem onClick={() => router.push('/' + session.user.name)}>
                  Perfil
                </StyledItem>
                <StyledSeparator />
                <StyledItem onClick={() => signOut()}>Sair</StyledItem>
                <StyledArrow />
              </UserSettingsModal>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Box>
            <button onClick={() => signIn('discord')}>Logar com Discord</button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
