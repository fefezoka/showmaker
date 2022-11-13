import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';
import { ProfileIcon } from '../profileIcon/ProfileIcon';
import { Header as StyledHeader, Container, UserSettings } from './style';

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <StyledHeader>
      <Container>
        <UserSettings>
          {status === 'authenticated' ? (
            <>
              <ProfileIcon src={session?.user?.image as string} />
              <div>
                <span>{session?.user?.name}</span>
              </div>
              <div>
                <button onClick={() => signOut()}>Sair</button>
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => signIn('discord')}>Logar com Discord</button>
            </div>
          )}
        </UserSettings>
      </Container>
    </StyledHeader>
  );
};
