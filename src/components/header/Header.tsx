import { signIn, signOut, useSession } from 'next-auth/react';
import React, { FormEvent, useRef } from 'react';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { IoSearchSharp } from 'react-icons/io5';
import { Header as StyledHeader, Container, UserContainer, Input } from './style';
import { useRouter } from 'next/router';

export const Header = () => {
  const { data: session, status } = useSession();
  const findRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFindClick = (e: FormEvent) => {
    e.preventDefault();
    if (findRef?.current?.value) {
      router.push(`/search/${findRef.current.value}`);
    }
  };

  return (
    <StyledHeader>
      <Container>
        <div style={{ maxWidth: '360px', width: '100%', position: 'relative' }}>
          <form onSubmit={(e) => handleFindClick(e)}>
            <Input ref={findRef} placeholder="Procurar" />
            <div style={{ position: 'absolute', right: 18, top: 10 }}>
              <button type="submit">
                <IoSearchSharp />
              </button>
            </div>
          </form>
        </div>
        <UserContainer>
          {status === 'authenticated' ? (
            <>
              <div
                onClick={() => router.push(`/${session.user.name}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <ProfileIcon src={session?.user?.image as string} alt="" />
                <h4>{session?.user?.name}</h4>
              </div>
              <button onClick={() => signOut()}>
                <h4> Sair</h4>
              </button>
            </>
          ) : (
            <div>
              <button onClick={() => signIn('discord')}>Logar com Discord</button>
            </div>
          )}
        </UserContainer>
      </Container>
    </StyledHeader>
  );
};
