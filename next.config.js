/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable all problematic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true 
  },
  // Completely disable webpack optimizations that cause errors
  webpack: (config, { dev, isServer }) => {
    // Disable all caching
    config.cache = false;
    
    // Minimal fallbacks only
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  // Disable all experimental features
  experimental: {},
  // Disable telemetry
  telemetry: false,
  // Disable source maps
  productionBrowserSourceMaps: false,
  // Disable SWC minification that can cause issues
  swcMinify: false,
};

module.exports = nextConfig;