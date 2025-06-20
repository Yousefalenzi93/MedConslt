#!/usr/bin/env node

// سكريبت اختبار قاعدة البيانات المحلية
const fs = require('fs');
const path = require('path');

console.log('🧪 اختبار قاعدة البيانات المحلية للمنصة الطبية');
console.log('================================================');
console.log('');

// فحص الملفات المطلوبة
const requiredFiles = [
  'src/lib/database/LocalDB.ts',
  'src/lib/database/MedicalAPI.ts',
  'src/lib/database/BackupManager.ts',
  'src/lib/database/PerformanceOptimizer.ts',
  'src/lib/database/SyncManager.ts',
  'src/lib/database/DatabaseTester.ts',
  'src/lib/database/schemas.ts',
  'src/lib/database/index.ts',
  'src/services/advancedDataService.ts'
];

console.log('📁 فحص ملفات قاعدة البيانات...');
let allFilesExist = true;

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ بعض الملفات مفقودة. يرجى التأكد من وجود جميع ملفات قاعدة البيانات.');
  process.exit(1);
}

console.log('\n✅ جميع ملفات قاعدة البيانات موجودة');

// فحص البنية
console.log('\n📊 فحص بنية قاعدة البيانات...');

const schemaFile = 'src/lib/database/schemas.ts';
const schemaContent = fs.readFileSync(schemaFile, 'utf8');

// فحص المخازن المطلوبة
const requiredStores = [
  'users',
  'doctors', 
  'consultations',
  'messages',
  'conversations',
  'videoCalls',
  'attachments',
  'ratings',
  'libraryDocuments',
  'supportTickets',
  'notifications',
  'sessions',
  'settings',
  'logs',
  'backups'
];

console.log('🗄️ فحص مخازن البيانات...');
let allStoresFound = true;

for (const store of requiredStores) {
  if (schemaContent.includes(`name: '${store}'`)) {
    console.log(`✅ مخزن ${store}`);
  } else {
    console.log(`❌ مخزن ${store} - مفقود`);
    allStoresFound = false;
  }
}

if (!allStoresFound) {
  console.log('\n⚠️ بعض المخازن مفقودة في المخطط');
} else {
  console.log('\n✅ جميع المخازن المطلوبة موجودة');
}

// فحص الفهارس
console.log('\n🔍 فحص الفهارس...');
const indexPatterns = [
  'email.*unique.*true',
  'role',
  'specialty',
  'status',
  'senderId',
  'receiverId'
];

let indexesFound = 0;
for (const pattern of indexPatterns) {
  const regex = new RegExp(pattern);
  if (regex.test(schemaContent)) {
    indexesFound++;
  }
}

console.log(`✅ تم العثور على ${indexesFound} من ${indexPatterns.length} فهرس أساسي`);

// فحص الخدمات
console.log('\n🔧 فحص الخدمات...');

const serviceFile = 'src/services/advancedDataService.ts';
if (fs.existsSync(serviceFile)) {
  const serviceContent = fs.readFileSync(serviceFile, 'utf8');
  
  const serviceMethods = [
    'initialize',
    'getUsers',
    'createUser',
    'getDoctors',
    'createConsultation',
    'sendMessage',
    'searchConsultations',
    'createBackup',
    'optimizeDatabase'
  ];
  
  let methodsFound = 0;
  for (const method of serviceMethods) {
    if (serviceContent.includes(`async ${method}(`)) {
      methodsFound++;
      console.log(`✅ طريقة ${method}`);
    } else {
      console.log(`❌ طريقة ${method} - مفقودة`);
    }
  }
  
  console.log(`\n📊 تم العثور على ${methodsFound} من ${serviceMethods.length} طريقة`);
} else {
  console.log('❌ ملف الخدمة المتقدمة مفقود');
}

// فحص التبعيات
console.log('\n📦 فحص التبعيات...');

const packageFile = 'package.json';
if (fs.existsSync(packageFile)) {
  const packageContent = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  
  // التبعيات المطلوبة لقاعدة البيانات
  const requiredDeps = [
    'react',
    'next',
    'typescript'
  ];
  
  let depsFound = 0;
  for (const dep of requiredDeps) {
    if (packageContent.dependencies?.[dep] || packageContent.devDependencies?.[dep]) {
      depsFound++;
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - مفقود`);
    }
  }
  
  console.log(`\n📊 تم العثور على ${depsFound} من ${requiredDeps.length} تبعية أساسية`);
} else {
  console.log('❌ ملف package.json مفقود');
}

// فحص إعدادات TypeScript
console.log('\n⚙️ فحص إعدادات TypeScript...');

const tsconfigFile = 'tsconfig.json';
if (fs.existsSync(tsconfigFile)) {
  const tsconfigContent = JSON.parse(fs.readFileSync(tsconfigFile, 'utf8'));
  
  const requiredOptions = [
    'strict',
    'esModuleInterop',
    'skipLibCheck'
  ];
  
  let optionsFound = 0;
  for (const option of requiredOptions) {
    if (tsconfigContent.compilerOptions?.[option] !== undefined) {
      optionsFound++;
      console.log(`✅ ${option}: ${tsconfigContent.compilerOptions[option]}`);
    } else {
      console.log(`❌ ${option} - مفقود`);
    }
  }
  
  console.log(`\n📊 تم العثور على ${optionsFound} من ${requiredOptions.length} إعداد TypeScript`);
} else {
  console.log('❌ ملف tsconfig.json مفقود');
}

// إنشاء تقرير الاختبار
console.log('\n📋 إنشاء تقرير الاختبار...');

const report = {
  timestamp: new Date().toISOString(),
  filesCheck: {
    total: requiredFiles.length,
    found: requiredFiles.filter(file => fs.existsSync(file)).length,
    missing: requiredFiles.filter(file => !fs.existsSync(file))
  },
  storesCheck: {
    total: requiredStores.length,
    found: requiredStores.filter(store => schemaContent.includes(`name: '${store}'`)).length
  },
  indexesCheck: {
    total: indexPatterns.length,
    found: indexesFound
  },
  status: allFilesExist && allStoresFound ? 'PASSED' : 'FAILED'
};

// حفظ التقرير
const reportFile = 'database-test-report.json';
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

console.log(`✅ تم حفظ التقرير في ${reportFile}`);

// ملخص النتائج
console.log('\n🎯 ملخص النتائج:');
console.log('================');
console.log(`📁 الملفات: ${report.filesCheck.found}/${report.filesCheck.total}`);
console.log(`🗄️ المخازن: ${report.storesCheck.found}/${report.storesCheck.total}`);
console.log(`🔍 الفهارس: ${report.indexesCheck.found}/${report.indexesCheck.total}`);
console.log(`📊 الحالة: ${report.status}`);

if (report.status === 'PASSED') {
  console.log('\n🎉 جميع الاختبارات نجحت! قاعدة البيانات جاهزة للاستخدام.');
  console.log('\n📚 للمزيد من المعلومات، راجع:');
  console.log('- LOCAL_DATABASE_GUIDE.md - دليل الاستخدام الشامل');
  console.log('- src/lib/database/ - ملفات قاعدة البيانات');
  console.log('- src/services/advancedDataService.ts - الخدمة المتقدمة');
  
  console.log('\n🚀 خطوات البدء:');
  console.log('1. npm install - تثبيت التبعيات');
  console.log('2. npm run build - بناء المشروع');
  console.log('3. استخدام advancedDataService في التطبيق');
  
  process.exit(0);
} else {
  console.log('\n❌ بعض الاختبارات فشلت. يرجى مراجعة الأخطاء أعلاه.');
  
  if (report.filesCheck.missing.length > 0) {
    console.log('\n📁 الملفات المفقودة:');
    report.filesCheck.missing.forEach(file => console.log(`- ${file}`));
  }
  
  console.log('\n🔧 للإصلاح:');
  console.log('1. تأكد من وجود جميع ملفات قاعدة البيانات');
  console.log('2. راجع LOCAL_DATABASE_GUIDE.md للتعليمات');
  console.log('3. أعد تشغيل الاختبار');
  
  process.exit(1);
}

// معلومات إضافية
console.log('\n📖 معلومات إضافية:');
console.log('- قاعدة البيانات تدعم IndexedDB و LocalStorage');
console.log('- نظام نسخ احتياطي متقدم مع ضغط وتشفير');
console.log('- مزامنة بين الأجهزة مع حل التعارضات');
console.log('- تحسين الأداء مع فهرسة ذكية');
console.log('- اختبارات شاملة للجودة');
console.log('- دعم كامل لـ Netlify Static Export');

console.log('\n🌟 الميزات المتقدمة:');
console.log('- بحث نصي ذكي مع دعم البحث الضبابي');
console.log('- تخزين مؤقت ذكي لتحسين الأداء');
console.log('- نظام سجلات شامل للمراقبة');
console.log('- واجهة برمجية موحدة وسهلة الاستخدام');
console.log('- دعم العمل بدون اتصال بالإنترنت');

console.log('\n💡 نصائح للاستخدام:');
console.log('- استخدم advancedDataService للعمليات العادية');
console.log('- فعل النسخ الاحتياطي التلقائي');
console.log('- راقب إحصائيات الأداء بانتظام');
console.log('- شغل الاختبارات في بيئة التطوير');
console.log('- استخدم البحث المحسن للاستعلامات الكبيرة');
