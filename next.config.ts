import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**.gmbr.pro",
      },
      {
        protocol: "https",
        hostname: "**.gmbr.pro",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
      },
      {
        protocol: "https",
        hostname: "**.kambingjantan.cc",
      },
      {
        protocol: "https",
        hostname: "manhwaindo.app",
      },
      {
        protocol: "https",
        hostname: "**.manhwaindo.app",
      },
      {
        protocol: "https",
        hostname: "**.manhwaindo.my",
      },
      {
        protocol: "https",
        hostname: "manhwaindo.my",
      },
    ],
  },
  // Allow cross-origin requests from local network during development
  allowedDevOrigins: ["192.168.1.8:3000", "192.168.1.8", "localhost:3000"],
};

export default nextConfig;
