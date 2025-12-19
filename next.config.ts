import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress output for faster loading
  compress: true,

  // Disable ESLint during build (warnings won't fail the build)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Use modern JavaScript output (reduces bundle size)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization - use unoptimized for Cloudflare Pages
  images: {
    unoptimized: true, // Required for Cloudflare Pages
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
