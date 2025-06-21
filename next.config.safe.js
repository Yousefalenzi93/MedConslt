/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات أساسية للتصدير الثابت
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // إعدادات الصور للتصدير الثابت
  images: { 
    unoptimized: true
  },
  
  // تجاهل أخطاء البناء
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
  
  // تحسينات الأداء
  swcMinify: true,
  reactStrictMode: false,
  
  // متغيرات البيئة
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  }
};

module.exports = nextConfig;
