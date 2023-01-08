/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
      'res.cloudinary.com',
      'osu.ppy.sh',
      'a.ppy.sh',
    ],
  },
};

module.exports = nextConfig;
