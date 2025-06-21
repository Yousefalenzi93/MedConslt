#!/usr/bin/env node

// سكريبت مساعد لرفع التحديثات إلى GitHub
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 مساعد رفع التحديثات إلى GitHub');
console.log('===================================');

function runCommand(command, description) {
  try {
    console.log(`\n📝 ${description}...`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} - نجح`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} - فشل:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    // 1. فحص حالة Git
    console.log('\n🔍 فحص حالة Git...');
    const status = runCommand('git status --porcelain', 'فحص الملفات المتغيرة');
    
    if (!status.trim()) {
      console.log('✅ لا توجد تغييرات للرفع');
      return;
    }
    
    console.log('📁 الملفات المتغيرة:');
    status.split('\n').forEach(line => {
      if (line.trim()) {
        console.log(`   ${line}`);
      }
    });
    
    // 2. إضافة جميع الملفات
    runCommand('git add .', 'إضافة جميع الملفات');
    
    // 3. إنشاء commit
    const commitMessage = 'Ultimate fix for all event handlers and build issues\n\n- Remove all dynamic exports\n- Fix event handlers in client components\n- Simplify AuthContext\n- Optimize next.config.js\n- Fix viewport in layout.tsx\n- Ready for Netlify deployment';
    
    runCommand(`git commit -m "${commitMessage}"`, 'إنشاء commit');
    
    // 4. فحص البرانش الحالي
    const currentBranch = runCommand('git branch --show-current', 'فحص البرانش الحالي').trim();
    console.log(`📍 البرانش الحالي: ${currentBranch}`);
    
    // 5. رفع التحديثات
    runCommand(`git push origin ${currentBranch}`, 'رفع التحديثات إلى GitHub');
    
    console.log('\n🎉 تم رفع التحديثات بنجاح!');
    console.log('=====================================');
    console.log('✅ جميع التحديثات تم رفعها إلى GitHub');
    console.log('✅ Netlify سيبدأ البناء تلقائياً');
    console.log('✅ تحقق من لوحة تحكم Netlify للنتائج');
    
    // 6. معلومات إضافية
    console.log('\n📋 معلومات مفيدة:');
    console.log(`🌐 رابط GitHub: https://github.com/YOUR_USERNAME/YOUR_REPO`);
    console.log(`🚀 رابط Netlify: https://app.netlify.com/sites/YOUR_SITE`);
    
    console.log('\n⏰ الخطوات التالية:');
    console.log('1. انتظر انتهاء البناء على Netlify (2-5 دقائق)');
    console.log('2. تحقق من عدم وجود أخطاء في سجل البناء');
    console.log('3. اختبر الموقع المنشور');
    
  } catch (error) {
    console.error('\n💥 فشل في رفع التحديثات:', error.message);
    
    console.log('\n🔧 حلول مقترحة:');
    console.log('1. تأكد من أنك متصل بالإنترنت');
    console.log('2. تأكد من صحة إعدادات Git:');
    console.log('   git config --global user.name "Your Name"');
    console.log('   git config --global user.email "your.email@example.com"');
    console.log('3. تأكد من صحة remote URL:');
    console.log('   git remote -v');
    console.log('4. إذا كانت المشكلة في المصادقة:');
    console.log('   - استخدم Personal Access Token بدلاً من كلمة المرور');
    console.log('   - أو استخدم SSH keys');
    
    console.log('\n📝 رفع يدوي:');
    console.log('git add .');
    console.log('git commit -m "Fix event handlers for Netlify"');
    console.log('git push origin main');
    
    process.exit(1);
  }
}

// تشغيل السكريبت
main().catch(error => {
  console.error('خطأ غير متوقع:', error);
  process.exit(1);
});
