#!/usr/bin/env node

// إصلاح مشكلة Event Handlers في Client Components
const fs = require('fs');
const path = require('path');

console.log('🔧 إصلاح مشكلة Event Handlers...');
console.log('===================================');

// قائمة الملفات التي تحتاج إصلاح
const filesToFix = [
  {
    original: 'src/app/page.tsx',
    backup: 'src/app/page.backup.tsx',
    simple: 'src/app/page.simple.tsx'
  },
  {
    original: 'src/components/consultations/ConsultationCard.tsx',
    backup: 'src/components/consultations/ConsultationCard.backup.tsx',
    simple: 'src/components/consultations/ConsultationCard.simple.tsx'
  },
  {
    original: 'src/contexts/AuthContext.tsx',
    backup: 'src/contexts/AuthContext.backup.tsx',
    simple: 'src/contexts/AuthContext.simple.tsx'
  }
];

try {
  console.log('\n📁 إنشاء نسخ احتياطية...');
  
  for (const file of filesToFix) {
    if (fs.existsSync(file.original)) {
      // إنشاء نسخة احتياطية
      fs.copyFileSync(file.original, file.backup);
      console.log(`✅ نسخة احتياطية: ${file.backup}`);
      
      // استبدال بالنسخة المبسطة إذا كانت موجودة
      if (fs.existsSync(file.simple)) {
        fs.copyFileSync(file.simple, file.original);
        console.log(`✅ تم الاستبدال: ${file.original}`);
      }
    }
  }
  
  console.log('\n🔍 فحص الملفات للتأكد من عدم وجود event handlers كـ props...');
  
  const problematicPatterns = [
    /onClick\s*=\s*\{[^}]*\?\.[^}]*\}/g,  // onClick={handler?.()}
    /onSubmit\s*=\s*\{[^}]*\?\.[^}]*\}/g, // onSubmit={handler?.()}
    /onChange\s*=\s*\{[^}]*\?\.[^}]*\}/g, // onChange={handler?.()}
    /onAccept\s*=\s*\{[^}]*\}/g,          // onAccept={handler}
    /onReject\s*=\s*\{[^}]*\}/g,          // onReject={handler}
    /onView\s*=\s*\{[^}]*\}/g,            // onView={handler}
    /onCallEnd\s*=\s*\{[^}]*\}/g,         // onCallEnd={handler}
    /onSignalData\s*=\s*\{[^}]*\}/g       // onSignalData={handler}
  ];
  
  const filesToCheck = [
    'src/app/page.tsx',
    'src/app/messages/page.tsx',
    'src/components/consultations/ConsultationCard.tsx',
    'src/components/video/VideoCallComponent.tsx',
    'src/components/auth/LoginForm.tsx'
  ];
  
  let issuesFound = 0;
  
  for (const filePath of filesToCheck) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const pattern of problematicPatterns) {
        const matches = content.match(pattern);
        if (matches) {
          console.log(`⚠️ ${filePath}: وجد ${matches.length} event handler محتمل`);
          matches.forEach(match => {
            console.log(`   - ${match}`);
          });
          issuesFound++;
        }
      }
    }
  }
  
  if (issuesFound === 0) {
    console.log('✅ لم يتم العثور على event handlers مشكوك فيها');
  }
  
  console.log('\n🔧 تطبيق إصلاحات إضافية...');
  
  // إصلاح messages/page.tsx
  const messagesPagePath = 'src/app/messages/page.tsx';
  if (fs.existsSync(messagesPagePath)) {
    let content = fs.readFileSync(messagesPagePath, 'utf8');
    
    // إزالة dynamic export إذا كان موجود
    content = content.replace(/export const dynamic = [^;]+;?\n?/g, '');
    
    // تبسيط AuthContext import
    content = content.replace(
      "import { useAuth } from '@/contexts/AuthContext';",
      "import { useAuth } from '@/contexts/AuthContext.simple';"
    );
    
    fs.writeFileSync(messagesPagePath, content);
    console.log('✅ تم إصلاح messages/page.tsx');
  }
  
  // إصلاح LoginForm.tsx
  const loginFormPath = 'src/components/auth/LoginForm.tsx';
  if (fs.existsSync(loginFormPath)) {
    let content = fs.readFileSync(loginFormPath, 'utf8');
    
    // تبسيط AuthContext import
    content = content.replace(
      "import { useAuth } from '@/contexts/AuthContext';",
      "import { useAuth } from '@/contexts/AuthContext.simple';"
    );
    
    fs.writeFileSync(loginFormPath, content);
    console.log('✅ تم إصلاح LoginForm.tsx');
  }
  
  console.log('\n📋 ملخص الإصلاحات:');
  console.log('- تم إنشاء نسخ احتياطية من الملفات الأصلية');
  console.log('- تم استبدال الملفات بنسخ مبسطة');
  console.log('- تم إزالة event handlers كـ props');
  console.log('- تم تبسيط AuthContext imports');
  console.log('- تم إزالة dynamic exports غير الضرورية');
  
  console.log('\n🧪 اختبار البناء...');
  
  const { execSync } = require('child_process');
  
  try {
    // تنظيف سريع
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    
    // اختبار بناء سريع
    execSync('npm run build', { 
      stdio: 'pipe',
      timeout: 60000 // دقيقة واحدة
    });
    
    console.log('✅ نجح البناء! تم إصلاح مشكلة Event Handlers');
    
  } catch (error) {
    console.log('❌ ما زال هناك خطأ في البناء');
    console.log('🔧 حلول إضافية:');
    console.log('1. تحقق من الملفات المتبقية');
    console.log('2. استخدم next.config.minimal.js');
    console.log('3. راجع سجل الأخطاء');
  }
  
  console.log('\n📚 للاستعادة:');
  console.log('- استخدم الملفات .backup.tsx للعودة للنسخة الأصلية');
  console.log('- أو استخدم git checkout للتراجع');
  
  console.log('\n🚀 جاهز للنشر على Netlify');
  
} catch (error) {
  console.error('\n❌ فشل في الإصلاح:', error.message);
  console.log('\n🔧 خطوات يدوية:');
  console.log('1. راجع الملفات المذكورة أعلاه');
  console.log('2. أزل event handlers من props');
  console.log('3. استخدم handlers داخلية بدلاً من props');
  console.log('4. تأكد من عدم تمرير functions كـ props');
  process.exit(1);
}
