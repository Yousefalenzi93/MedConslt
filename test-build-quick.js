#!/usr/bin/env node

// اختبار سريع للبناء قبل النشر على Netlify
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 اختبار سريع للبناء...');
console.log('========================');

try {
  // 1. فحص الملفات الأساسية
  console.log('\n📁 فحص الملفات الأساسية...');
  const requiredFiles = [
    'next.config.js',
    'package.json',
    '.npmrc',
    'netlify.toml'
  ];
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - مفقود`);
      process.exit(1);
    }
  }
  
  // 2. فحص next.config.js
  console.log('\n⚙️ فحص next.config.js...');
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  if (nextConfig.includes('output: \'export\'')) {
    console.log('✅ output: export موجود');
  } else {
    console.log('❌ output: export مفقود');
    process.exit(1);
  }
  
  if (nextConfig.includes('appDir')) {
    console.log('⚠️ تحذير: appDir موجود - قد يسبب مشاكل');
  }
  
  if (nextConfig.includes('loaderFile')) {
    console.log('⚠️ تحذير: loaderFile موجود - تأكد من وجود الملف');
  }
  
  // 3. تنظيف المجلدات
  console.log('\n🧹 تنظيف المجلدات...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
    console.log('✅ تم حذف .next');
  }
  
  if (fs.existsSync('out')) {
    execSync('rm -rf out', { stdio: 'inherit' });
    console.log('✅ تم حذف out');
  }
  
  // 4. تثبيت التبعيات
  console.log('\n📦 تثبيت التبعيات...');
  execSync('npm install --legacy-peer-deps --no-audit --no-fund', { 
    stdio: 'inherit',
    timeout: 120000 // 2 دقيقة
  });
  console.log('✅ تم تثبيت التبعيات');
  
  // 5. بناء المشروع
  console.log('\n🔨 بناء المشروع...');
  execSync('npm run build', { 
    stdio: 'inherit',
    timeout: 300000 // 5 دقائق
  });
  console.log('✅ تم بناء المشروع بنجاح');
  
  // 6. فحص مجلد out
  console.log('\n📂 فحص مجلد out...');
  if (fs.existsSync('out')) {
    const files = fs.readdirSync('out');
    console.log(`✅ مجلد out يحتوي على ${files.length} ملف/مجلد`);
    
    // فحص الملفات الأساسية
    const essentialFiles = ['index.html', '_next'];
    for (const file of essentialFiles) {
      if (files.includes(file)) {
        console.log(`✅ ${file} موجود`);
      } else {
        console.log(`❌ ${file} مفقود`);
      }
    }
  } else {
    console.log('❌ مجلد out غير موجود');
    process.exit(1);
  }
  
  console.log('\n🎉 نجح الاختبار! المشروع جاهز للنشر على Netlify');
  console.log('\n📋 خطوات النشر:');
  console.log('1. git add .');
  console.log('2. git commit -m "Fix build issues"');
  console.log('3. git push origin main');
  
} catch (error) {
  console.error('\n❌ فشل الاختبار:', error.message);
  console.log('\n🔧 خطوات الإصلاح:');
  console.log('1. npm run fix-netlify');
  console.log('2. تحقق من الأخطاء أعلاه');
  console.log('3. أعد تشغيل الاختبار');
  process.exit(1);
}
