import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import OsuProvider from 'next-auth/providers/osu';
import TwitchProvider from 'next-auth/providers/twitch';
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
    TwitchProvider({
      profile(profile) {
        return {
          id: profile.preferred_username,
          email: profile.email,
          image: profile.picture,
          name: profile.preferred_username,
        };
      },
      clientId: process.env.TWITCH_ID!,
      clientSecret: process.env.TWITCH_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // if (account?.provider === 'osu') {
      //   await prisma.user.update({
      //     data: {
      //       osuAccountId: account.providerAccountId,
      //     },
      //     where: {
      //       id: account.userId,
      //     },
      //   });
      // }

      if (account?.provider === 'discord' && profile && user) {
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
