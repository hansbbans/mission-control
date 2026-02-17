/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static generation, use server rendering only
  output: 'standalone',
  experimental: {
    // Don't try to export or prerender anything
    isrMemoryCacheSize: 0,
  },
  // Skip next export
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
