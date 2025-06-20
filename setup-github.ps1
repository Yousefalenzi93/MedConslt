# إعداد Git ورفع المشروع على GitHub
param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$RepositoryName = "medical-consultation-platform"
)

Write-Host "🚀 إعداد Git ورفع المشروع على GitHub" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "🔍 فحص Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git متوفر: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git غير مثبت" -ForegroundColor Red
    Write-Host "يرجى تحميل Git من: https://git-scm.com" -ForegroundColor Yellow
    exit 1
}

# Initialize git if not already initialized
Write-Host ""
Write-Host "📁 إعداد Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ تم إنشاء مستودع Git محلي" -ForegroundColor Green
} else {
    Write-Host "✅ مستودع Git موجود بالفعل" -ForegroundColor Green
}

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "❌ ملف .gitignore غير موجود" -ForegroundColor Red
    Write-Host "يرجى إنشاء ملف .gitignore أولاً" -ForegroundColor Yellow
    exit 1
}

# Add all files
Write-Host ""
Write-Host "📦 إضافة الملفات..." -ForegroundColor Yellow
git add .

# Check git status
Write-Host ""
Write-Host "📋 حالة الملفات:" -ForegroundColor Yellow
git status --short

# Commit
Write-Host ""
Write-Host "💾 إنشاء commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: Medical consultation platform

✨ Features:
- 🏥 Complete medical consultation platform
- 🤖 AI assistant integration
- 📹 Video call functionality
- 📱 Responsive design
- 🔒 Secure authentication
- 📊 Advanced analytics

🛠️ Tech Stack:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod validation

🚀 Ready for Netlify deployment!"

git commit -m "$commitMessage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ تم إنشاء commit بنجاح" -ForegroundColor Green
} else {
    Write-Host "❌ فشل في إنشاء commit" -ForegroundColor Red
    exit 1
}

# Set main branch
Write-Host ""
Write-Host "🌿 إعداد الفرع الرئيسي..." -ForegroundColor Yellow
git branch -M main
Write-Host "✅ تم إعداد فرع main" -ForegroundColor Green

# Add remote origin
Write-Host ""
Write-Host "🔗 إضافة remote origin..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$GitHubUsername/$RepositoryName.git"

# Remove existing origin if exists
git remote remove origin 2>$null

git remote add origin $remoteUrl
Write-Host "✅ تم إضافة remote: $remoteUrl" -ForegroundColor Green

# Instructions for GitHub
Write-Host ""
Write-Host "📋 الخطوات التالية:" -ForegroundColor Cyan
Write-Host "1. اذهب إلى: https://github.com/new" -ForegroundColor White
Write-Host "2. اسم المستودع: $RepositoryName" -ForegroundColor White
Write-Host "3. اختر Public أو Private" -ForegroundColor White
Write-Host "4. لا تضيف README أو .gitignore (موجودان بالفعل)" -ForegroundColor White
Write-Host "5. انقر 'Create repository'" -ForegroundColor White

Write-Host ""
Write-Host "🚀 بعد إنشاء المستودع، شغل:" -ForegroundColor Cyan
Write-Host "git push -u origin main" -ForegroundColor Yellow

Write-Host ""
Write-Host "🌐 للربط مع Netlify:" -ForegroundColor Cyan
Write-Host "1. اذهب إلى: https://netlify.com" -ForegroundColor White
Write-Host "2. انقر 'New site from Git'" -ForegroundColor White
Write-Host "3. اختر GitHub واختر المستودع" -ForegroundColor White
Write-Host "4. الإعدادات ستُقرأ تلقائياً من netlify.toml" -ForegroundColor White

Write-Host ""
Write-Host "📁 الملفات المرفوعة:" -ForegroundColor Cyan
$files = git ls-files | Measure-Object
Write-Host "عدد الملفات: $($files.Count)" -ForegroundColor Green

Write-Host ""
Write-Host "✅ تم الإعداد بنجاح!" -ForegroundColor Green
Write-Host "المشروع جاهز للرفع على GitHub والربط مع Netlify" -ForegroundColor Green

Write-Host ""
Write-Host "اضغط أي مفتاح للخروج..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
