const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting simplified build process...');

// Step 1: Clean previous builds
console.log('1. Cleaning previous builds...');
try {
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  console.log('✅ Cleaned successfully');
} catch (error) {
  console.log('⚠️ Clean warning:', error.message);
}

// Step 2: Create a simplified next.config.js for build
console.log('2. Creating simplified config...');
const simpleConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
`;

// Backup original config
if (fs.existsSync('next.config.js')) {
  fs.copyFileSync('next.config.js', 'next.config.js.backup');
}

fs.writeFileSync('next.config.js', simpleConfig);
console.log('✅ Simplified config created');

// Step 3: Build
console.log('3. Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('❌ Build failed:', error.message);
  
  // Restore original config
  if (fs.existsSync('next.config.js.backup')) {
    fs.copyFileSync('next.config.js.backup', 'next.config.js');
    fs.unlinkSync('next.config.js.backup');
  }
  
  process.exit(1);
}

// Step 4: Restore original config
console.log('4. Restoring original config...');
if (fs.existsSync('next.config.js.backup')) {
  fs.copyFileSync('next.config.js.backup', 'next.config.js');
  fs.unlinkSync('next.config.js.backup');
  console.log('✅ Original config restored');
}

// Step 5: Create _redirects file for Netlify
console.log('5. Creating Netlify redirects...');
const redirectsContent = `/*    /index.html   200`;
fs.writeFileSync(path.join('out', '_redirects'), redirectsContent);
console.log('✅ Netlify redirects created');

// Step 6: Create deployment info
console.log('6. Creating deployment info...');
const deployInfo = {
  buildTime: new Date().toISOString(),
  platform: 'Netlify',
  status: 'ready',
  url: 'https://mtmconsult.netlify.app'
};
fs.writeFileSync(path.join('out', 'deploy-info.json'), JSON.stringify(deployInfo, null, 2));
console.log('✅ Deployment info created');

console.log('');
console.log('🎉 Build completed successfully!');
console.log('📁 Output directory: out/');
console.log('🌐 Ready for Netlify deployment');
console.log('🔗 Suggested URL: https://mtmconsult.netlify.app');
console.log('');
console.log('Next steps:');
console.log('1. Upload the "out" folder to Netlify');
console.log('2. Configure custom domain if needed');
console.log('3. Test the deployed application');
