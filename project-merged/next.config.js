/** @type {import('next').NextConfig} */
const path = require('path');

// Debug logging function
const debug = (...args) => {
  console.log('\n[DEBUG]', ...args, '\n');
};

const nextConfig = {
  // Configure for static export
  output: 'export',
  distDir: 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  
  env: {
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  },

  // Exclude API routes from static export
  experimental: {
    appDir: true,
  },

  // Disable server-side API routes in static export
  // experimental: {
  //   optimizeCss: {
  //     preset: ['default', { 
  //       discardComments: { removeAll: true },
  //       mergeLonghand: false,
  //       cssDeclarationSorter: false
  //     }]
  //   },
  //   outputFileTracingRoot: path.join(__dirname),
  //   outputFileTracingExcludes: {
  //     '*': [
  //       'node_modules/@swc/core-linux-x64-gnu',
  //       'node_modules/@swc/core-linux-x64-musl',
  //       'node_modules/@esbuild/linux-x64',
  //     ],
  //   },
  // },

  webpack: (config, { isServer, dev }) => {
    debug('Webpack build starting');
    debug('Build mode:', dev ? 'development' : 'production');
    debug('Environment:', isServer ? 'server' : 'client');
    debug('Node version:', process.version);
    debug('Dependencies:', {
      next: require('next/package.json').version,
      react: require('react/package.json').version,
      postcss: require('postcss/package.json').version,
      tailwindcss: require('tailwindcss/package.json').version,
    });

    // Add more detailed webpack logging
    config.infrastructureLogging = {
      level: 'verbose',
    };

    // Basic alias configuration
    config.resolve.alias = {
      '@': path.join(__dirname, 'src'),
    };

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig 