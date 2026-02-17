/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation completely
  staticPageGenerationTimeout: 0,
  // Output as standalone so Vercel doesn't try to pre-render
  output: 'standalone',
};

module.exports = nextConfig;
