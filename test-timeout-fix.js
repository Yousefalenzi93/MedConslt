#!/usr/bin/env node

// اختبار إصلاح مشكلة timeout في البناء
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 اختبار إصلاح مشكلة Timeout...');
console.log('===================================');

try {
  // 1. فحص layout.tsx
  console.log('\n📄 فحص layout.tsx...');
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  
  if (layoutContent.includes('viewport:')) {
    console.log('❌ viewport موجود في metadata - يجب نقله');
    process.exit(1);
  }
  
  if (layoutContent.includes('export const viewport')) {
    console.log('✅ viewport منفصل بشكل صحيح');
  } else {
    console.log('❌ viewport غير منفصل');
    process.exit(1);
  }
  
  if (layoutContent.includes('AuthContext.simple')) {
    console.log('✅ يستخدم AuthProvider المبسط');
  } else {
    console.log('⚠️ يستخدم AuthProvider المعقد');
  }
  
  // 2. فحص next.config.js
  console.log('\n⚙️ فحص next.config.js...');
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  if (nextConfig.includes('workerThreads: false')) {
    console.log('✅ workerThreads معطل');
  } else {
    console.log('⚠️ workerThreads غير معطل');
  }
  
  // 3. تنظيف سريع
  console.log('\n🧹 تنظيف سريع...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
    console.log('✅ تم حذف .next');
  }
  
  // 4. اختبار بناء سريع
  console.log('\n⚡ اختبار بناء سريع (30 ثانية)...');
  
  const startTime = Date.now();
  
  try {
    execSync('npm run build', { 
      stdio: 'pipe',
      timeout: 30000 // 30 ثانية فقط
    });
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ نجح البناء في ${duration.toFixed(1)} ثانية`);
    
    if (duration > 25) {
      console.log('⚠️ البناء بطيء - قد يحتاج تحسين');
    }
    
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;
    
    if (error.signal === 'SIGTERM' || duration >= 30) {
      console.log('❌ timeout - البناء يستغرق أكثر من 30 ثانية');
      console.log('\n🔧 حلول مقترحة:');
      console.log('1. تبسيط metadata أكثر');
      console.log('2. إزالة imports غير ضرورية');
      console.log('3. تعطيل strict mode');
      console.log('4. استخدام AuthProvider أبسط');
    } else {
      console.log('❌ خطأ في البناء:', error.message);
    }
    
    process.exit(1);
  }
  
  // 5. فحص النتيجة
  console.log('\n📂 فحص النتيجة...');
  if (fs.existsSync('out/index.html')) {
    console.log('✅ تم إنشاء index.html');
  } else {
    console.log('❌ index.html مفقود');
    process.exit(1);
  }
  
  console.log('\n🎉 تم إصلاح مشكلة timeout!');
  console.log('\n📋 التغييرات المطبقة:');
  console.log('- فصل viewport عن metadata');
  console.log('- تبسيط metadata');
  console.log('- استخدام AuthProvider مبسط');
  console.log('- تعطيل workerThreads');
  
  console.log('\n🚀 جاهز للنشر على Netlify');
  
} catch (error) {
  console.error('\n❌ فشل الاختبار:', error.message);
  console.log('\n🔧 خطوات الإصلاح:');
  console.log('1. تحقق من layout.tsx');
  console.log('2. تحقق من next.config.js');
  console.log('3. تحقق من AuthProvider');
  console.log('4. أعد تشغيل الاختبار');
  process.exit(1);
}
