import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn1-production-images-kly.akamaized.net", // ganti dengan domain lain kalau pakai CDN sendiri
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      ...(process.env.CONVEX_HOSTNAME ? [{
        protocol: "https" as const,
        hostname: process.env.CONVEX_HOSTNAME,
        pathname: "/**",
      }] : []),
    ],
  },
};

export default nextConfig;
