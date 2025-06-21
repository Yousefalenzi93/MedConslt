/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // إعدادات لحل مشكلة timeout
  experimental: {
    staticPageGenerationTimeout: 300,
    workerThreads: false,
    cpus: 1,
    isrMemoryCacheSize: 0
  },
  // تحسين الأداء
  swcMinify: true,
  reactStrictMode: false,
  // متغيرات البيئة
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  }
};

module.exports = nextConfig;
