import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
// import DiscordProvider from 'next-auth/providers/discord';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
