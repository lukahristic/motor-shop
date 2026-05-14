import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "img.lazcdn.com",
      },
      {
        protocol: "https",
        hostname:  "res.cloudinary.com",  
      },
      {
        protocol: "https",
        hostname: "www.lazada.com.ph",
      }

    ],
  },
}

export default nextConfig