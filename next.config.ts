import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The hero and the Top NSN marquee use the client's photography from
  // Unsplash while the real asset library is pending. See design.md → Imagery.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
