Write-Host "========================================" -ForegroundColor Cyan
Write-Host "بناء منصة الاستشارات الطبية" -ForegroundColor Cyan
Write-Host "للنشر على Netlify" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🏥 إعداد المشروع للنشر على https://mtmconsult.netlify.app" -ForegroundColor Green
Write-Host ""

# Check Node.js
Write-Host "🔧 فحص Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js متوفر: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ: Node.js غير مثبت!" -ForegroundColor Red
    Write-Host "يرجى تثبيت Node.js من https://nodejs.org/" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 تثبيت التبعيات..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل في تثبيت التبعيات!" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}
Write-Host "✅ تم تثبيت التبعيات بنجاح" -ForegroundColor Green

# Clean previous builds
Write-Host ""
Write-Host "🧹 تنظيف الملفات السابقة..." -ForegroundColor Yellow
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
Write-Host "✅ تم تنظيف الملفات السابقة" -ForegroundColor Green

# Build project
Write-Host ""
Write-Host "🔨 بناء المشروع للإنتاج..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ فشل في بناء المشروع!" -ForegroundColor Red
    Write-Host "تحقق من الأخطاء أعلاه" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}
Write-Host "✅ تم بناء المشروع بنجاح" -ForegroundColor Green

# Check output directory
Write-Host ""
Write-Host "📁 فحص مجلد الإخراج..." -ForegroundColor Yellow
if (-not (Test-Path "out")) {
    Write-Host "❌ مجلد out غير موجود!" -ForegroundColor Red
    Write-Host "تحقق من إعدادات next.config.js" -ForegroundColor Red
    Read-Host "اضغط Enter للخروج"
    exit 1
}
Write-Host "✅ مجلد out جاهز للنشر" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 تم بناء المشروع بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 مجلد النشر: out/" -ForegroundColor White
Write-Host "🌐 الموقع المستهدف: https://mtmconsult.netlify.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 خطوات النشر:" -ForegroundColor White
Write-Host ""
Write-Host "الطريقة الأولى (Drag & Drop):" -ForegroundColor Yellow
Write-Host "1. اذهب إلى netlify.com" -ForegroundColor Gray
Write-Host "2. سجل الدخول إلى حسابك" -ForegroundColor Gray
Write-Host "3. اسحب مجلد 'out' إلى منطقة الرفع" -ForegroundColor Gray
Write-Host ""
Write-Host "الطريقة الثانية (GitHub):" -ForegroundColor Yellow
Write-Host "1. ارفع المشروع إلى GitHub" -ForegroundColor Gray
Write-Host "2. اربط المستودع مع Netlify" -ForegroundColor Gray
Write-Host "3. اضبط Build command: npm run build" -ForegroundColor Gray
Write-Host "4. اضبط Publish directory: out" -ForegroundColor Gray
Write-Host ""
Write-Host "الطريقة الثالثة (Netlify CLI):" -ForegroundColor Yellow
Write-Host "1. npm install -g netlify-cli" -ForegroundColor Gray
Write-Host "2. netlify login" -ForegroundColor Gray
Write-Host "3. netlify deploy --prod --dir=out" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 بيانات الدخول التجريبية:" -ForegroundColor White
Write-Host "   طبيب: doctor@example.com / demo123" -ForegroundColor Cyan
Write-Host "   مدير: admin@example.com / admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ ملاحظة: النظام يعمل بدون Firebase للاختبار" -ForegroundColor Yellow
Write-Host "   للإنتاج الحقيقي، أضف متغيرات البيئة في Netlify" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "هل تريد فتح مجلد out؟ (y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Start-Process "explorer" -ArgumentList "out"
}

Write-Host ""
Write-Host "شكراً لاستخدام منصة الاستشارات الطبية!" -ForegroundColor Green
Read-Host "اضغط Enter للخروج"
