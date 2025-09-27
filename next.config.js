/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Image optimization settings
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Enable experimental features if needed
  experimental: {
    // serverActions: true,
  },
};

module.exports = nextConfig;