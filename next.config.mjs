/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "manhwaindo.web.id",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.manhwaindo.my",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "kacu.gmbr.pro",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
