// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * remotePatterns is the secure way to allow external images.
     * We specify the protocol and hostname for each provider.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Profile Pictures
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub Profile Pictures
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary Assets
      },
    ],
  },
};

export default nextConfig;