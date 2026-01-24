import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["res.cloudinary.com"],
    remotePatterns: [
       {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",  // allows all images from Cloudinary
      },
    ],
  },
};

export default nextConfig;
