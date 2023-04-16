import NextAuth from 'next-auth';
import { User } from './types';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      id: string;
      createdAt: string;
      email: string;
      followersAmount: number;
      followingAmount: number;
      image: string;
      updatedAt: string;
    };
  }

  interface Profile {
    id: string;
    username: string;
    email: string;
    image_url: string;
  }
}
