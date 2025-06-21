@echo off
title منصة الاستشارات الطبية - Medical Consultation Platform

echo.
echo ========================================
echo منصة الاستشارات الطبية
echo Medical Consultation Platform
echo ========================================
echo.

echo 🏥 مرحباً بك في منصة الاستشارات الطبية الشاملة
echo.

echo 📋 المتطلبات:
echo    ✅ Node.js 18+ (سيتم فحصه)
echo    ✅ npm (مدير الحزم)
echo    ✅ متصفح حديث
echo.

echo 🔧 فحص Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت!
    echo.
    echo يرجى تثبيت Node.js من: https://nodejs.org/
    echo ثم إعادة تشغيل هذا الملف
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js متوفر: %NODE_VERSION%
echo.

echo 📦 تثبيت التبعيات...
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    echo جرب تشغيل: npm install
    pause
    exit /b 1
)
echo ✅ تم تثبيت التبعيات بنجاح
echo.

echo 🚀 تشغيل النظام...
echo.
echo ========================================
echo 🌐 النظام سيكون متاح على:
echo    http://localhost:3000
echo.
echo 🔑 بيانات الدخول التجريبية:
echo.
echo    👨‍⚕️ حساب طبيب:
echo       البريد: doctor@example.com
echo       المرور: demo123
echo.
echo    👨‍💼 حساب مدير:
echo       البريد: admin@example.com  
echo       المرور: admin123
echo.
echo 📝 الميزات المتاحة:
echo    • الاستشارات الطبية الشاملة
echo    • المكالمات المرئية عبر WebRTC
echo    • المكتبة الطبية التفاعلية
echo    • نظام المراسلة الآمن
echo    • تقييم الأطباء والخدمات
echo    • لوحة تحكم الإدارة
echo    • واجهة عربية كاملة RTL
echo.
echo ⚠️  ملاحظة: نظام تجريبي - لا يتطلب Firebase
echo.
echo اضغط Ctrl+C لإيقاف الخادم
echo ========================================
echo.

echo انتظر قليلاً... سيتم فتح المتصفح تلقائياً
echo.

rem فتح المتصفح بعد 5 ثوان
start /b timeout /t 5 /nobreak >nul && start http://localhost:3000

rem تشغيل الخادم
call npm run dev

echo.
echo تم إيقاف النظام.
echo شكراً لاستخدام منصة الاستشارات الطبية!
pause
