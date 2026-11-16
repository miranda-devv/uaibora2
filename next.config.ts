import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Keep local builds viable on this machine without filling the disk cache.
    cpus: 1,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
