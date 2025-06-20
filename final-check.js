#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 فحص نهائي للنظام قبل النشر...\n');

const checks = [
  {
    name: 'ملف package.json',
    check: () => fs.existsSync('package.json'),
    fix: 'تأكد من وجود ملف package.json'
  },
  {
    name: 'ملف next.config.js',
    check: () => fs.existsSync('next.config.js'),
    fix: 'تأكد من وجود ملف next.config.js'
  },
  {
    name: 'ملف netlify.toml',
    check: () => fs.existsSync('netlify.toml'),
    fix: 'تأكد من وجود ملف netlify.toml'
  },
  {
    name: 'ملف tsconfig.json',
    check: () => fs.existsSync('tsconfig.json'),
    fix: 'تأكد من وجود ملف tsconfig.json'
  },
  {
    name: 'ملف .eslintrc.json',
    check: () => fs.existsSync('.eslintrc.json'),
    fix: 'تأكد من وجود ملف .eslintrc.json'
  },
  {
    name: 'مجلد src',
    check: () => fs.existsSync('src') && fs.statSync('src').isDirectory(),
    fix: 'تأكد من وجود مجلد src'
  },
  {
    name: 'مجلد public',
    check: () => fs.existsSync('public') && fs.statSync('public').isDirectory(),
    fix: 'تأكد من وجود مجلد public'
  },
  {
    name: 'ملف src/app/layout.tsx',
    check: () => fs.existsSync('src/app/layout.tsx'),
    fix: 'تأكد من وجود ملف layout.tsx'
  },
  {
    name: 'ملف src/app/page.tsx',
    check: () => fs.existsSync('src/app/page.tsx'),
    fix: 'تأكد من وجود ملف page.tsx'
  },
  {
    name: 'ملف src/app/globals.css',
    check: () => fs.existsSync('src/app/globals.css'),
    fix: 'تأكد من وجود ملف globals.css'
  },
  {
    name: 'مجلد src/data',
    check: () => fs.existsSync('src/data') && fs.statSync('src/data').isDirectory(),
    fix: 'تأكد من وجود مجلد البيانات'
  },
  {
    name: 'ملفات البيانات',
    check: () => {
      const dataFiles = ['users.json', 'consultations.json', 'messages.json'];
      return dataFiles.every(file => fs.existsSync(`src/data/${file}`));
    },
    fix: 'تأكد من وجود جميع ملفات البيانات'
  },
  {
    name: 'مجلد node_modules',
    check: () => fs.existsSync('node_modules') && fs.statSync('node_modules').isDirectory(),
    fix: 'شغل npm install'
  },
  {
    name: 'ملف public/_redirects',
    check: () => fs.existsSync('public/_redirects'),
    fix: 'تأكد من وجود ملف _redirects'
  },
  {
    name: 'ملف public/manifest.json',
    check: () => fs.existsSync('public/manifest.json'),
    fix: 'تأكد من وجود ملف manifest.json'
  }
];

let passedChecks = 0;
let failedChecks = 0;

console.log('📋 نتائج الفحص:\n');

checks.forEach((check, index) => {
  const result = check.check();
  if (result) {
    console.log(`✅ ${index + 1}. ${check.name}`);
    passedChecks++;
  } else {
    console.log(`❌ ${index + 1}. ${check.name}`);
    console.log(`   💡 الحل: ${check.fix}`);
    failedChecks++;
  }
});

console.log('\n📊 ملخص النتائج:');
console.log(`✅ نجح: ${passedChecks}`);
console.log(`❌ فشل: ${failedChecks}`);
console.log(`📈 النسبة: ${Math.round((passedChecks / checks.length) * 100)}%`);

if (failedChecks === 0) {
  console.log('\n🎉 ممتاز! النظام جاهز للنشر على Netlify');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. شغل: npm run build');
  console.log('2. ارفع مجلد "out" إلى Netlify');
  console.log('3. أو اربط المشروع بـ GitHub ثم Netlify');
} else {
  console.log('\n⚠️ يجب إصلاح المشاكل أعلاه قبل النشر');
  console.log('راجع الحلول المقترحة وأعد المحاولة');
}

console.log('\n🔗 روابط مفيدة:');
console.log('- دليل النشر: ./NETLIFY_DEPLOY_GUIDE.md');
console.log('- README: ./README.md');
console.log('- Netlify: https://netlify.com');
