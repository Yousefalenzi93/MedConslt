// Simple build test script
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🔍 Testing Medical Consultation Platform Build...')

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found!')
  process.exit(1)
}

// Check if src directory exists
if (!fs.existsSync('src')) {
  console.error('❌ src directory not found!')
  process.exit(1)
}

// Check main files
const requiredFiles = [
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js'
]

console.log('📁 Checking required files...')
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - Missing!`)
  }
}

// Check dependencies
console.log('\n📦 Checking dependencies...')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'i18next',
    'react-i18next',
    'lucide-react',
    'tailwindcss'
  ]
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}`)
    } else {
      console.log(`❌ ${dep} - Missing!`)
    }
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message)
}

console.log('\n🏗️ Build test completed!')
console.log('\n📋 Next steps:')
console.log('1. Run: npm install')
console.log('2. Run: npm run build')
console.log('3. Check dist folder')
console.log('4. Deploy to Netlify')

console.log('\n🌐 Netlify deployment tips:')
console.log('- Build command: npm run build')
console.log('- Publish directory: dist')
console.log('- Node version: 18')
console.log('- Add environment variables if needed')
