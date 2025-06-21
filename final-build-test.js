#!/usr/bin/env node

// اختبار نهائي شامل قبل النشر على Netlify
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 اختبار نهائي شامل للمشروع...');
console.log('===================================');

async function runTest(name, testFn) {
  console.log(`\n🧪 ${name}...`);
  try {
    const result = await testFn();
    console.log(`✅ ${name} - نجح`);
    return { name, success: true, result };
  } catch (error) {
    console.log(`❌ ${name} - فشل: ${error.message}`);
    return { name, success: false, error: error.message };
  }
}

async function main() {
  const results = [];
  
  // 1. فحص الملفات الأساسية
  results.push(await runTest('فحص الملفات الأساسية', async () => {
    const requiredFiles = [
      'next.config.js',
      'package.json',
      '.npmrc',
      'netlify.toml',
      'src/app/layout.tsx',
      'src/app/page.tsx'
    ];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`ملف مطلوب مفقود: ${file}`);
      }
    }
    
    return { filesChecked: requiredFiles.length };
  }));
  
  // 2. فحص Event Handlers
  results.push(await runTest('فحص Event Handlers', async () => {
    try {
      execSync('node check-event-handlers.js', { stdio: 'pipe' });
      return { eventHandlersClean: true };
    } catch (error) {
      throw new Error('وجدت Event Handlers مشكوك فيها');
    }
  }));
  
  // 3. فحص next.config.js
  results.push(await runTest('فحص next.config.js', async () => {
    const config = fs.readFileSync('next.config.js', 'utf8');
    
    if (!config.includes('output: \'export\'')) {
      throw new Error('output: export مفقود');
    }
    
    if (config.includes('appDir')) {
      throw new Error('appDir deprecated موجود');
    }
    
    if (config.includes('loaderFile')) {
      throw new Error('loaderFile موجود بدون ملف');
    }
    
    return { configValid: true };
  }));
  
  // 4. فحص layout.tsx
  results.push(await runTest('فحص layout.tsx', async () => {
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
    
    if (layout.includes('viewport:')) {
      throw new Error('viewport في metadata بدلاً من منفصل');
    }
    
    if (!layout.includes('export const viewport')) {
      throw new Error('viewport منفصل مفقود');
    }
    
    if (layout.includes('AuthContext.simple')) {
      return { layoutValid: true, usingSimpleAuth: true };
    } else {
      return { layoutValid: true, usingSimpleAuth: false };
    }
  }));
  
  // 5. تنظيف المجلدات
  results.push(await runTest('تنظيف المجلدات', async () => {
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { stdio: 'inherit' });
    }
    
    if (fs.existsSync('out')) {
      execSync('rm -rf out', { stdio: 'inherit' });
    }
    
    return { cleaned: true };
  }));
  
  // 6. تثبيت التبعيات
  results.push(await runTest('تثبيت التبعيات', async () => {
    execSync('npm install --legacy-peer-deps --no-audit --no-fund', { 
      stdio: 'pipe',
      timeout: 120000 // 2 دقيقة
    });
    
    return { dependenciesInstalled: true };
  }));
  
  // 7. اختبار البناء
  results.push(await runTest('اختبار البناء', async () => {
    const startTime = Date.now();
    
    execSync('npm run build', { 
      stdio: 'pipe',
      timeout: 180000 // 3 دقائق
    });
    
    const duration = Date.now() - startTime;
    
    if (!fs.existsSync('out')) {
      throw new Error('مجلد out لم يتم إنشاؤه');
    }
    
    if (!fs.existsSync('out/index.html')) {
      throw new Error('index.html مفقود');
    }
    
    const files = fs.readdirSync('out');
    
    return { 
      buildSuccessful: true,
      duration: Math.round(duration / 1000),
      outputFiles: files.length
    };
  }));
  
  // 8. فحص النتيجة النهائية
  results.push(await runTest('فحص النتيجة النهائية', async () => {
    const indexHtml = fs.readFileSync('out/index.html', 'utf8');
    
    if (!indexHtml.includes('<html')) {
      throw new Error('HTML غير صحيح');
    }
    
    const nextDir = fs.existsSync('out/_next');
    const assetsCount = nextDir ? fs.readdirSync('out/_next').length : 0;
    
    return {
      htmlValid: true,
      hasAssets: nextDir,
      assetsCount
    };
  }));
  
  // تلخيص النتائج
  console.log('\n📊 ملخص النتائج:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ نجح: ${successful}/${total}`);
  console.log(`❌ فشل: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 جميع الاختبارات نجحت!');
    console.log('🚀 المشروع جاهز للنشر على Netlify');
    
    console.log('\n📋 خطوات النشر:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix all event handlers and build issues"');
    console.log('3. git push origin main');
    console.log('4. انتظر النشر على Netlify');
    
    // إنشاء تقرير نجاح
    const successReport = {
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      tests: results,
      readyForDeployment: true
    };
    
    fs.writeFileSync('build-success-report.json', JSON.stringify(successReport, null, 2));
    console.log('\n📋 تم حفظ تقرير النجاح في build-success-report.json');
    
    process.exit(0);
    
  } else {
    console.log('\n❌ بعض الاختبارات فشلت');
    
    const failedTests = results.filter(r => !r.success);
    console.log('\n🔧 الاختبارات الفاشلة:');
    failedTests.forEach(test => {
      console.log(`- ${test.name}: ${test.error}`);
    });
    
    console.log('\n🛠️ خطوات الإصلاح:');
    console.log('1. راجع الأخطاء أعلاه');
    console.log('2. npm run fix-event-handlers');
    console.log('3. npm run check-event-handlers');
    console.log('4. أعد تشغيل هذا الاختبار');
    
    // إنشاء تقرير فشل
    const failureReport = {
      timestamp: new Date().toISOString(),
      status: 'FAILURE',
      tests: results,
      failedTests: failedTests,
      readyForDeployment: false
    };
    
    fs.writeFileSync('build-failure-report.json', JSON.stringify(failureReport, null, 2));
    console.log('\n📋 تم حفظ تقرير الفشل في build-failure-report.json');
    
    process.exit(1);
  }
}

// تشغيل الاختبار
main().catch(error => {
  console.error('\n💥 خطأ غير متوقع:', error);
  process.exit(1);
});
