@echo off
title بناء مبسط لمنصة الاستشارات الطبية

echo.
echo ========================================
echo بناء مبسط للنشر على Netlify
echo ========================================
echo.

echo 🔧 إعداد الملفات المبسطة...

REM Backup original files
if exist "next.config.js" copy "next.config.js" "next.config.js.backup"
if exist "tailwind.config.js" copy "tailwind.config.js" "tailwind.config.js.backup"
if exist "package.json" copy "package.json" "package.json.backup"

REM Use simple configs
copy "next.config.simple.js" "next.config.js"
copy "tailwind.config.simple.js" "tailwind.config.js"
copy "package.simple.json" "package.json"

echo ✅ تم إعداد الملفات المبسطة

echo.
echo 🧹 تنظيف الملفات السابقة...
if exist "out" rmdir /s /q "out"
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"

echo.
echo 📦 تثبيت التبعيات المبسطة...
call npm install

echo.
echo 🔨 بناء المشروع...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ فشل في البناء
    goto restore
)

echo.
echo ✅ تم البناء بنجاح!
echo 📁 مجلد النشر: out/
echo.

:restore
echo 🔄 استعادة الملفات الأصلية...
if exist "next.config.js.backup" (
    copy "next.config.js.backup" "next.config.js"
    del "next.config.js.backup"
)
if exist "tailwind.config.js.backup" (
    copy "tailwind.config.js.backup" "tailwind.config.js"
    del "tailwind.config.js.backup"
)
if exist "package.json.backup" (
    copy "package.json.backup" "package.json"
    del "package.json.backup"
)

echo.
echo ========================================
echo النظام جاهز للنشر على Netlify!
echo ========================================
pause
