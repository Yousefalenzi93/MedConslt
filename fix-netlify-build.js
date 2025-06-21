#!/usr/bin/env node

// سكريبت إصلاح مشاكل البناء على Netlify
const fs = require('fs');
const path = require('path');

console.log('🔧 إصلاح مشاكل البناء على Netlify...');
console.log('=====================================');

// 1. التحقق من ملف package.json
console.log('\n📦 فحص package.json...');
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // التحقق من engines
  if (!packageJson.engines) {
    packageJson.engines = {
      "node": ">=18.0.0",
      "npm": ">=8.0.0"
    };
    console.log('✅ تم إضافة engines');
  }
  
  // التحقق من build script
  if (!packageJson.scripts['build:netlify']) {
    packageJson.scripts['build:netlify'] = 'npm install --legacy-peer-deps && next build';
    console.log('✅ تم إضافة build:netlify script');
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ تم تحديث package.json');
} else {
  console.log('❌ ملف package.json غير موجود');
}

// 2. التحقق من ملف .npmrc
console.log('\n⚙️ فحص .npmrc...');
const npmrcPath = '.npmrc';
const npmrcContent = `legacy-peer-deps=true
fund=false
audit=false
progress=false
loglevel=error`;

if (!fs.existsSync(npmrcPath)) {
  fs.writeFileSync(npmrcPath, npmrcContent);
  console.log('✅ تم إنشاء ملف .npmrc');
} else {
  console.log('✅ ملف .npmrc موجود');
}

// 3. التحقق من next.config.js
console.log('\n⚙️ فحص next.config.js...');
const nextConfigPath = 'next.config.js';
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

  if (!nextConfig.includes('output: \'export\'')) {
    console.log('⚠️ تأكد من وجود output: "export" في next.config.js');
  } else {
    console.log('✅ إعدادات Next.js صحيحة');
  }

  // التحقق من عدم وجود إعدادات متعارضة
  if (nextConfig.includes('appDir')) {
    console.log('⚠️ تم العثور على appDir في experimental - قد يسبب مشاكل');
  }

  if (nextConfig.includes('loaderFile')) {
    console.log('⚠️ تم العثور على loaderFile - تأكد من وجود الملف');
  }
} else {
  console.log('❌ ملف next.config.js غير موجود');
}

// 4. التحقق من netlify.toml
console.log('\n🌐 فحص netlify.toml...');
const netlifyTomlPath = 'netlify.toml';
if (fs.existsSync(netlifyTomlPath)) {
  const netlifyToml = fs.readFileSync(netlifyTomlPath, 'utf8');
  
  if (netlifyToml.includes('npm ci')) {
    console.log('⚠️ يُنصح بتغيير npm ci إلى npm install --legacy-peer-deps');
  } else {
    console.log('✅ إعدادات Netlify صحيحة');
  }
} else {
  console.log('❌ ملف netlify.toml غير موجود');
}

// 5. التحقق من الملفات المطلوبة
console.log('\n📁 فحص الملفات المطلوبة...');
const requiredFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'public/manifest.json',
  'public/_redirects'
];

let missingFiles = [];
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
    missingFiles.push(file);
  }
}

// 6. إنشاء الملفات المفقودة الأساسية
if (missingFiles.includes('public/_redirects')) {
  console.log('\n📝 إنشاء ملف _redirects...');
  const redirectsContent = `/*    /index.html   200`;
  fs.writeFileSync('public/_redirects', redirectsContent);
  console.log('✅ تم إنشاء public/_redirects');
}

if (missingFiles.includes('public/manifest.json')) {
  console.log('\n📝 إنشاء ملف manifest.json...');
  const manifestContent = {
    "name": "Medical Consultation Platform",
    "short_name": "MedicalApp",
    "description": "منصة الاستشارات الطبية",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "icons": [
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  };
  fs.writeFileSync('public/manifest.json', JSON.stringify(manifestContent, null, 2));
  console.log('✅ تم إنشاء public/manifest.json');
}

// 7. فحص مجلد out
console.log('\n📂 فحص مجلد out...');
if (fs.existsSync('out')) {
  console.log('⚠️ مجلد out موجود - سيتم حذفه في البناء التالي');
} else {
  console.log('✅ مجلد out غير موجود (طبيعي)');
}

// 8. نصائح للإصلاح
console.log('\n💡 نصائح لحل مشاكل البناء:');
console.log('================================');
console.log('1. تأكد من استخدام Node.js 18+');
console.log('2. استخدم npm install --legacy-peer-deps بدلاً من npm ci');
console.log('3. تأكد من وجود output: "export" في next.config.js');
console.log('4. تأكد من وجود جميع الملفات المطلوبة');
console.log('5. تحقق من عدم وجود أخطاء TypeScript');

// 9. أوامر مفيدة
console.log('\n🔧 أوامر مفيدة للاختبار:');
console.log('==========================');
console.log('npm run clean          # تنظيف المجلدات');
console.log('npm install --legacy-peer-deps  # تثبيت التبعيات');
console.log('npm run build          # بناء المشروع');
console.log('npm run final-check    # فحص شامل');

// 10. إعدادات Netlify المُوصى بها
console.log('\n🌐 إعدادات Netlify المُوصى بها:');
console.log('=================================');
console.log('Build command: npm install --legacy-peer-deps && npm run build');
console.log('Publish directory: out');
console.log('Node version: 18.17.0');

console.log('\n✅ تم الانتهاء من فحص وإصلاح الإعدادات');
console.log('🚀 جرب البناء الآن: npm run build');

// إنشاء تقرير
const report = {
  timestamp: new Date().toISOString(),
  fixes_applied: [
    'تحديث package.json',
    'إنشاء .npmrc',
    'فحص next.config.js',
    'فحص netlify.toml',
    'إنشاء الملفات المفقودة'
  ],
  missing_files: missingFiles,
  recommendations: [
    'استخدم npm install --legacy-peer-deps',
    'تأكد من Node.js 18+',
    'تحقق من إعدادات Netlify'
  ]
};

fs.writeFileSync('netlify-fix-report.json', JSON.stringify(report, null, 2));
console.log('\n📋 تم حفظ تقرير الإصلاح في netlify-fix-report.json');
