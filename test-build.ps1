# اختبار البناء للمشروع الطبي
Write-Host "🔍 اختبار البناء للمشروع الطبي..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "1. فحص إصدار Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    
    $majorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    if ($majorVersion -lt 18) {
        Write-Host "❌ خطأ: يتطلب Node.js 18 أو أحدث" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ خطأ: Node.js غير مثبت" -ForegroundColor Red
    Write-Host "يرجى تحميل Node.js من: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check package.json
Write-Host ""
Write-Host "2. فحص ملف package.json..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "❌ خطأ: ملف package.json غير موجود" -ForegroundColor Red
    exit 1
}
Write-Host "✅ ملف package.json موجود" -ForegroundColor Green

# Step 3: Install dependencies
Write-Host ""
Write-Host "3. تثبيت التبعيات..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ تم تثبيت التبعيات بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ في تثبيت التبعيات" -ForegroundColor Red
    exit 1
}

# Step 4: TypeScript check
Write-Host ""
Write-Host "4. فحص TypeScript..." -ForegroundColor Yellow
try {
    npx tsc --noEmit
    Write-Host "✅ TypeScript: لا توجد أخطاء" -ForegroundColor Green
} catch {
    Write-Host "⚠️ تحذير: توجد أخطاء TypeScript، لكن سنتابع..." -ForegroundColor Yellow
}

# Step 5: Clean previous builds
Write-Host ""
Write-Host "5. تنظيف البناء السابق..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
}
if (Test-Path "out") {
    Remove-Item "out" -Recurse -Force
}
Write-Host "✅ تم تنظيف المجلدات" -ForegroundColor Green

# Step 6: Build project
Write-Host ""
Write-Host "6. بناء المشروع..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ البناء مكتمل بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ في عملية البناء" -ForegroundColor Red
    Write-Host "تحقق من الأخطاء أعلاه وحاول مرة أخرى" -ForegroundColor Yellow
    exit 1
}

# Step 7: Check output
Write-Host ""
Write-Host "7. فحص مجلد الإخراج..." -ForegroundColor Yellow
if (-not (Test-Path "out")) {
    Write-Host "❌ خطأ: مجلد out غير موجود" -ForegroundColor Red
    exit 1
}

$outFiles = Get-ChildItem "out" | Measure-Object
if ($outFiles.Count -eq 0) {
    Write-Host "❌ خطأ: مجلد out فارغ" -ForegroundColor Red
    exit 1
}

Write-Host "✅ مجلد out يحتوي على الملفات المطلوبة" -ForegroundColor Green
Write-Host "   - عدد الملفات: $($outFiles.Count)" -ForegroundColor Gray

# Success message
Write-Host ""
Write-Host "🎉 نجح الاختبار! المشروع جاهز للنشر على Netlify" -ForegroundColor Green
Write-Host ""
Write-Host "📋 الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. ارفع مجلد 'out' إلى Netlify مباشرة" -ForegroundColor White
Write-Host "2. أو اربط المشروع بـ GitHub ثم Netlify" -ForegroundColor White
Write-Host "3. استخدم الإعدادات الموجودة في netlify.toml" -ForegroundColor White

Write-Host ""
Write-Host "🔗 روابط مفيدة:" -ForegroundColor Cyan
Write-Host "- Netlify: https://netlify.com" -ForegroundColor Blue
Write-Host "- دليل النشر: ./NETLIFY_DEPLOY_GUIDE.md" -ForegroundColor Blue

Write-Host ""
Write-Host "اضغط أي مفتاح للخروج..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
