// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",   // ← add this line
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
}

export default nextConfig