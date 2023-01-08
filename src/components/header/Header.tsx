import React, { FormEvent, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { IoSearchSharp, IoCaretDown, IoCaretUp } from 'react-icons/io5';
import {
  Header as StyledHeader,
  Container,
  UserContainer,
  Input,
  UserSettingsModal,
  StyledItem,
  StyledSeparator,
  StyledArrow,
} from './style';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/router';
import { useIsDesktop } from '../../hooks/useIsDesktop';

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
    <StyledHeader>
      <Container>
        <div
          style={{
            maxWidth: '360px',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <form onSubmit={(e) => handleFindClick(e)}>
            <Input ref={findRef} placeholder="Procurar" />
            <div style={{ position: 'absolute', right: 18, top: 14 }}>
              <button type="submit">
                <IoSearchSharp color="white" />
              </button>
            </div>
          </form>
        </div>

        {status === 'authenticated' ? (
          <DropdownMenu.Root open={open ? true : false} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <UserContainer onClick={() => router.push(`/${session.user.name}`)}>
                <ProfileIcon src={session?.user?.image as string} alt="" />
                {isDesktop && <h4>{session?.user?.name}</h4>}
                {open ? <IoCaretUp /> : <IoCaretDown />}
              </UserContainer>
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
          <div>
            <button onClick={() => signIn('discord')}>Logar com Discord</button>
          </div>
        )}
      </Container>
    </StyledHeader>
  );
};
