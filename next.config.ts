import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/assets/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    }
  },
  // Configure static asset handling
  assetPrefix: process.env.NODE_ENV === "production" ? undefined : "",
};

export default nextConfig;
