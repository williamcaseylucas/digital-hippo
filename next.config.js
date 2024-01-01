/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "dist/.next",
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "**",
        port: "3000",
        protocol: "http",
      },
    ],
  },
};

module.exports = nextConfig;

//   distDir: "dist",
