import NextAuth, { DefaultSession } from 'next-auth';
import { OsuProfile } from 'next-auth/providers/osu';

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
