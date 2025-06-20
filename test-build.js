#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 اختبار البناء للمشروع الطبي...\n');

// Step 1: Check Node.js version
console.log('1. فحص إصدار Node.js...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
  
  const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
  if (majorVersion < 18) {
    console.log('❌ خطأ: يتطلب Node.js 18 أو أحدث');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ خطأ: Node.js غير مثبت');
  process.exit(1);
}

// Step 2: Check if package.json exists
console.log('\n2. فحص ملف package.json...');
if (!fs.existsSync('package.json')) {
  console.log('❌ خطأ: ملف package.json غير موجود');
  process.exit(1);
}
console.log('✅ ملف package.json موجود');

// Step 3: Check TypeScript configuration
console.log('\n3. فحص إعدادات TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript: لا توجد أخطاء');
} catch (error) {
  console.log('⚠️  تحذير: توجد أخطاء TypeScript، لكن سنتابع...');
}

// Step 4: Test build process
console.log('\n4. اختبار عملية البناء...');
try {
  console.log('   - تنظيف المجلدات السابقة...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  
  console.log('   - بدء عملية البناء...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ البناء مكتمل بنجاح');
} catch (error) {
  console.log('❌ خطأ في عملية البناء');
  console.log('تفاصيل الخطأ:', error.message);
  process.exit(1);
}

// Step 5: Check output directory
console.log('\n5. فحص مجلد الإخراج...');
if (!fs.existsSync('out')) {
  console.log('❌ خطأ: مجلد out غير موجود');
  process.exit(1);
}

const outFiles = fs.readdirSync('out');
if (outFiles.length === 0) {
  console.log('❌ خطأ: مجلد out فارغ');
  process.exit(1);
}

console.log('✅ مجلد out يحتوي على الملفات المطلوبة');
console.log(`   - عدد الملفات: ${outFiles.length}`);

// Step 6: Check essential files
console.log('\n6. فحص الملفات الأساسية...');
const essentialFiles = ['index.html', '_next'];
const missingFiles = essentialFiles.filter(file => !outFiles.includes(file));

if (missingFiles.length > 0) {
  console.log('❌ ملفات مفقودة:', missingFiles.join(', '));
  process.exit(1);
}

console.log('✅ جميع الملفات الأساسية موجودة');

// Success message
console.log('\n🎉 نجح الاختبار! المشروع جاهز للنشر على Netlify');
console.log('\n📋 الخطوات التالية:');
console.log('1. ارفع مجلد "out" إلى Netlify مباشرة');
console.log('2. أو اربط المشروع بـ GitHub ثم Netlify');
console.log('3. استخدم الإعدادات الموجودة في netlify.toml');

console.log('\n🔗 روابط مفيدة:');
console.log('- Netlify: https://netlify.com');
console.log('- دليل النشر: ./NETLIFY_DEPLOY_GUIDE.md');
