import axios from "@/server/axios"

interface DiscordUser {
  id: string
  username: string
  avatar: string | null
  discriminator: string
}

export const discordAvatarUrl = (user: DiscordUser) => {
  if (user.avatar) {
    const format = user.avatar.startsWith("a_") ? "gif" : "png"
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}`
  }

  const index =
    user.discriminator === "0"
      ? Number(BigInt(user.id) >> BigInt(22)) % 6
      : Number(user.discriminator) % 5
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

// Uses the bot token so it works for any user, without depending on their
// OAuth access token (which expires).
export const fetchDiscordAvatar = async (discordId: string) => {
  const { data } = await axios.get<DiscordUser>(
    `https://discord.com/api/v10/users/${discordId}`,
    { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
  )

  return discordAvatarUrl(data)
}
