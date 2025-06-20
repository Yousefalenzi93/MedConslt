/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: [],
    formats: ['image/webp']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    appDir: true,
    optimizeCss: true
  },
  env: {
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1'
  },
  // تحسين الأداء
  swcMinify: true,
  reactStrictMode: false,
  // إزالة console.log في الإنتاج
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

module.exports = nextConfig;
