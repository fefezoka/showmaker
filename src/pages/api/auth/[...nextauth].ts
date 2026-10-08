import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { AuthOptions, User } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import OsuProvider from "next-auth/providers/osu"
import TwitchProvider from "next-auth/providers/twitch"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      issuer: "https://discord.com",
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
        }
      },
      clientId: process.env.TWITCH_ID!,
      clientSecret: process.env.TWITCH_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const { id, image, name, createdAt } = user

      return {
        ...session,
        user: { id, image, name, createdAt } as User,
      }
    },
  },
  events: {
    // Runs after the adapter has created/linked the user, so user.id always
    // exists in the database (unlike the signIn callback on first login).
    async signIn({ user, account, profile }) {
      if (account?.provider !== "discord" || !profile) return

      const image = profile.image_url as string
      const name = profile.username as string

      if (image !== user.image || name !== user.name) {
        await prisma.user
          .update({ where: { id: user.id }, data: { name, image } })
          .catch(() => {})
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
