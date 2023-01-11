import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface Profile {
    id: string;
    username: string;
    email: string;
    image_url: string;
  }
}
