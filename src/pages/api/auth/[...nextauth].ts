import { PrismaAdapter } from '@next-auth/prisma-adapter';
import axios from 'axios';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import OsuProvider from 'next-auth/providers/osu';
import { prisma } from '../../../lib/prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
    OsuProvider({
      clientId: process.env.OSU_ID!,
      clientSecret: process.env.OSU_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (profile && user && account!.provider === 'discord') {
        if (profile.image_url !== user.image || profile.username !== user.name) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              name: profile.username,
              image: profile.image_url,
            },
          });
        }
      }
      return true;
    },
    async session({ session, user }) {
      return {
        ...session,
        user: { ...user } as User,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
