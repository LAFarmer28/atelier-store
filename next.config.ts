import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the test suite run its own dev server next to a running `pnpm dev`
  // (each dev server locks its build directory).
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
