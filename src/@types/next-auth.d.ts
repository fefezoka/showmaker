import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
  }

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
