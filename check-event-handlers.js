#!/usr/bin/env node

// فحص شامل للـ Event Handlers في جميع الملفات
const fs = require('fs');
const path = require('path');

console.log('🔍 فحص شامل للـ Event Handlers...');
console.log('===================================');

// أنماط Event Handlers المشكوك فيها
const problematicPatterns = [
  {
    pattern: /\bon[A-Z][a-zA-Z]*\s*=\s*\{[^}]*\}/g,
    description: 'Event handlers as props (onSomething={...})'
  },
  {
    pattern: /\bon[A-Z][a-zA-Z]*\?\.\(/g,
    description: 'Optional event handler calls (onSomething?.())'
  },
  {
    pattern: /interface\s+\w+Props\s*\{[^}]*\bon[A-Z][a-zA-Z]*\??\s*:/g,
    description: 'Event handlers in Props interfaces'
  },
  {
    pattern: /export const dynamic = ['"]force-dynamic['"];?/g,
    description: 'Dynamic force exports'
  }
];

// مجلدات للفحص
const foldersToCheck = [
  'src/app',
  'src/components',
  'src/contexts'
];

// امتدادات الملفات للفحص
const fileExtensions = ['.tsx', '.ts', '.jsx', '.js'];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (fileExtensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  for (const { pattern, description } of problematicPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        description,
        matches: matches.slice(0, 3), // أول 3 تطابقات فقط
        count: matches.length
      });
    }
  }
  
  return issues;
}

function main() {
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  console.log('\n📁 جمع الملفات للفحص...');
  
  let allFiles = [];
  for (const folder of foldersToCheck) {
    allFiles = allFiles.concat(getAllFiles(folder));
  }
  
  console.log(`📊 سيتم فحص ${allFiles.length} ملف`);
  
  console.log('\n🔍 بدء الفحص...');
  
  for (const filePath of allFiles) {
    const issues = checkFile(filePath);
    
    if (issues.length > 0) {
      filesWithIssues++;
      console.log(`\n❌ ${filePath}:`);
      
      for (const issue of issues) {
        totalIssues += issue.count;
        console.log(`   🔸 ${issue.description} (${issue.count} مرة)`);
        
        for (const match of issue.matches) {
          const truncated = match.length > 60 ? match.substring(0, 60) + '...' : match;
          console.log(`      - ${truncated}`);
        }
      }
    }
  }
  
  console.log('\n📊 ملخص النتائج:');
  console.log('================');
  console.log(`📁 إجمالي الملفات المفحوصة: ${allFiles.length}`);
  console.log(`❌ ملفات تحتوي على مشاكل: ${filesWithIssues}`);
  console.log(`🔸 إجمالي المشاكل: ${totalIssues}`);
  
  if (totalIssues === 0) {
    console.log('\n🎉 ممتاز! لا توجد مشاكل Event Handlers');
    console.log('✅ المشروع جاهز للبناء');
    return true;
  } else {
    console.log('\n⚠️ تم العثور على مشاكل تحتاج إصلاح');
    console.log('\n🔧 خطوات الإصلاح:');
    console.log('1. أزل event handlers من Props interfaces');
    console.log('2. استخدم handlers داخلية بدلاً من props');
    console.log('3. أزل dynamic exports غير الضرورية');
    console.log('4. تأكد من عدم تمرير functions كـ props');
    
    console.log('\n🛠️ أدوات مساعدة:');
    console.log('npm run fix-event-handlers  # إصلاح تلقائي');
    console.log('npm run test-build-quick    # اختبار البناء');
    
    return false;
  }
}

// تشغيل الفحص
const success = main();

// إنشاء تقرير
const report = {
  timestamp: new Date().toISOString(),
  totalFiles: 0,
  filesWithIssues: 0,
  totalIssues: 0,
  success: success
};

fs.writeFileSync('event-handlers-check-report.json', JSON.stringify(report, null, 2));

console.log('\n📋 تم حفظ التقرير في event-handlers-check-report.json');

if (success) {
  console.log('\n🚀 المشروع جاهز للنشر على Netlify!');
  process.exit(0);
} else {
  console.log('\n❌ يرجى إصلاح المشاكل قبل النشر');
  process.exit(1);
}
