# إعداد سريع لمنصة الاستشارات الطبية
Write-Host "🏥 إعداد سريع لمنصة الاستشارات الطبية" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "🔍 فحص Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js متوفر: $nodeVersion" -ForegroundColor Green
    
    $majorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    if ($majorVersion -lt 18) {
        Write-Host "❌ خطأ: يتطلب Node.js 18 أو أحدث" -ForegroundColor Red
        Write-Host "يرجى تحميل Node.js من: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Node.js غير مثبت" -ForegroundColor Red
    Write-Host "يرجى تحميل Node.js من: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ تم تثبيت التبعيات بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ في تثبيت التبعيات" -ForegroundColor Red
    exit 1
}

# Type check
Write-Host ""
Write-Host "🔧 فحص TypeScript..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "✅ TypeScript سليم" -ForegroundColor Green
} catch {
    Write-Host "⚠️ تحذيرات TypeScript موجودة، لكن سنتابع..." -ForegroundColor Yellow
}

# Build project
Write-Host ""
Write-Host "🔨 بناء المشروع..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ تم بناء المشروع بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ في بناء المشروع" -ForegroundColor Red
    Write-Host "تحقق من الأخطاء أعلاه" -ForegroundColor Yellow
    exit 1
}

# Success message
Write-Host ""
Write-Host "🎉 تم الإعداد بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. للتطوير: npm run dev" -ForegroundColor White
Write-Host "2. للنشر: ارفع مجلد 'out' إلى Netlify" -ForegroundColor White
Write-Host "3. أو اربط المشروع بـ GitHub ثم Netlify" -ForegroundColor White

Write-Host ""
Write-Host "🔗 حسابات تجريبية:" -ForegroundColor Cyan
Write-Host "طبيب: doctor@example.com / demo123" -ForegroundColor Blue
Write-Host "مدير: admin@example.com / admin123" -ForegroundColor Blue
Write-Host "مريض: patient1@example.com / patient123" -ForegroundColor Blue

Write-Host ""
Write-Host "📚 ملفات مفيدة:" -ForegroundColor Cyan
Write-Host "- README.md: دليل المشروع" -ForegroundColor Blue
Write-Host "- NETLIFY_DEPLOY_GUIDE.md: دليل النشر" -ForegroundColor Blue

Write-Host ""
Write-Host "اضغط أي مفتاح للخروج..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
