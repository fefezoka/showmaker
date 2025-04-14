/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'osu.ppy.sh',
      },
      {
        protocol: 'https',
        hostname: 'a.ppy.sh',
      },
      {
        protocol: 'https',
        hostname: 'assets.ppy.sh',
      },
    ],
  },
};

module.exports = nextConfig;
