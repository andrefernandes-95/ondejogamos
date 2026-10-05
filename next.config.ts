import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-public-presigner-production-7feb.up.railway.app",
        port: "",
        pathname: "/pitches/**",
      },
    ],
  },
};

export default nextConfig;
