import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Don't advertise the framework in an X-Powered-By response header.
  poweredByHeader: false,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [new URL("https://images.unsplash.com/**")],
    qualities: [75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
