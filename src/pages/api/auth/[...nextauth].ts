import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions, User } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import OsuProvider from 'next-auth/providers/osu';
import TwitchProvider from 'next-auth/providers/twitch';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
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
          createdAt: new Date(),
        };
      },
      clientId: process.env.TWITCH_ID!,
      clientSecret: process.env.TWITCH_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
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
      const { id, image, name, createdAt } = user;

      return {
        ...session,
        user: { id, image, name, createdAt } as User,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
