import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev JS is blocked unless the page's host is allowlisted. Phones use the LAN IP.
  allowedDevOrigins: ["192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
  images: {
    // AVIF where the browser supports it (smaller photos), WebP otherwise
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days
  },
  async headers() {
    // /public files have no content hash, so cache for a day and revalidate in the background
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return ["/rocks/:path*", "/wood/:path*", "/footer/:path*", "/images/:path*", "/JupitexLogos/:path*"].map(
      (source) => ({ source, headers: cache })
    );
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
