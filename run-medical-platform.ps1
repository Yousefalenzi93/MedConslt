Write-Host "========================================" -ForegroundColor Cyan
Write-Host "منصة الاستشارات الطبية" -ForegroundColor Cyan
Write-Host "Medical Consultation Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
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

# Check npm
Write-Host "🔧 فحص npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm متوفر: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ: npm غير متوفر!" -ForegroundColor Red
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

# Check TypeScript
Write-Host ""
Write-Host "🔧 فحص TypeScript..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ تحذير: مشاكل في TypeScript، لكن سنتابع..." -ForegroundColor Yellow
} else {
    Write-Host "✅ TypeScript سليم" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 تشغيل النظام..." -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 المنصة ستكون متاحة على:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 بيانات الدخول التجريبية:" -ForegroundColor White
Write-Host "   طبيب: doctor@example.com / demo123" -ForegroundColor Yellow
Write-Host "   مدير: admin@example.com / admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 الميزات المتاحة:" -ForegroundColor White
Write-Host "   - الاستشارات الطبية الشاملة" -ForegroundColor Gray
Write-Host "   - المكالمات المرئية عبر WebRTC" -ForegroundColor Gray
Write-Host "   - المكتبة الطبية التفاعلية" -ForegroundColor Gray
Write-Host "   - نظام الرسائل الآمن" -ForegroundColor Gray
Write-Host "   - تقييم الأطباء والخدمات" -ForegroundColor Gray
Write-Host "   - لوحة تحكم الإدارة" -ForegroundColor Gray
Write-Host "   - واجهة عربية كاملة RTL" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️ ملاحظة: هذا نظام تجريبي للعرض" -ForegroundColor Yellow
Write-Host "   لا يتطلب إعداد Firebase للاختبار" -ForegroundColor Yellow
Write-Host ""
Write-Host "اضغط Ctrl+C لإيقاف الخادم" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Open browser after delay
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"

# Start development server
npm run dev
