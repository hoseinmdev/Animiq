import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.nekosapi.com",
        pathname: "/nekos-api/**",
      },
      {
        protocol: "https",
        hostname: "safebooru.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
