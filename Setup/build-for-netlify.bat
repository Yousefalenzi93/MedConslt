@echo off
title بناء منصة الاستشارات الطبية للنشر على Netlify

echo.
echo ========================================
echo بناء منصة الاستشارات الطبية
echo للنشر على Netlify
echo ========================================
echo.

echo 🏥 إعداد المشروع للنشر على https://mtmconsult.netlify.app
echo.

echo 🔧 فحص Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت!
    echo يرجى تثبيت Node.js من: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js متوفر: %NODE_VERSION%
echo.

echo 📦 تثبيت التبعيات...
call npm install
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
)
echo ✅ تم تثبيت التبعيات بنجاح
echo.

echo 🧹 تنظيف الملفات السابقة...
if exist "out" rmdir /s /q "out"
if exist ".next" rmdir /s /q ".next"
echo ✅ تم تنظيف الملفات السابقة
echo.

echo 🔨 بناء المشروع للإنتاج...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ فشل في بناء المشروع
    echo تحقق من الأخطاء أعلاه
    pause
    exit /b 1
)
echo ✅ تم بناء المشروع بنجاح
echo.

echo 📁 فحص مجلد الإخراج...
if not exist "out" (
    echo ❌ مجلد out غير موجود!
    echo تحقق من إعدادات next.config.js
    pause
    exit /b 1
)
echo ✅ مجلد out جاهز للنشر
echo.

echo ========================================
echo 🎉 تم بناء المشروع بنجاح!
echo.
echo 📂 مجلد النشر: out/
echo 🌐 الموقع المستهدف: https://mtmconsult.netlify.app
echo.
echo 📋 خطوات النشر:
echo.
echo الطريقة الأولى (Drag & Drop):
echo 1. اذهب إلى netlify.com
echo 2. سجل الدخول إلى حسابك
echo 3. اسحب مجلد "out" إلى منطقة الرفع
echo.
echo الطريقة الثانية (GitHub):
echo 1. ارفع المشروع إلى GitHub
echo 2. اربط المستودع مع Netlify
echo 3. اضبط Build command: npm run build
echo 4. اضبط Publish directory: out
echo.
echo الطريقة الثالثة (Netlify CLI):
echo 1. npm install -g netlify-cli
echo 2. netlify login
echo 3. netlify deploy --prod --dir=out
echo.
echo 🔑 بيانات الدخول التجريبية:
echo    طبيب: doctor@example.com / demo123
echo    مدير: admin@example.com / admin123
echo.
echo ⚠️  ملاحظة: النظام يعمل بدون Firebase للاختبار
echo    للإنتاج الحقيقي، أضف متغيرات البيئة في Netlify
echo ========================================
echo.

echo هل تريد فتح مجلد out؟ (y/n)
set /p choice=
if /i "%choice%"=="y" (
    start explorer "out"
)

echo.
echo شكراً لاستخدام منصة الاستشارات الطبية!
pause
