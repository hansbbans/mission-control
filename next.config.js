/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for Convex pages
  staticPageGenerationTimeout: 0,
  // Skip static optimization
  experimental: {
    isrMemoryCacheSize: 0,
  },
};

module.exports = nextConfig;
