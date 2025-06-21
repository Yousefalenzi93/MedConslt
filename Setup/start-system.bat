@echo off
echo ========================================
echo منصة الاستشارات الطبية
echo Medical Consultation Platform
echo ========================================
echo.

echo 🔧 تحقق من Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ خطأ: Node.js غير مثبت
    pause
    exit /b 1
)
echo ✅ Node.js متوفر

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
echo 🔧 فحص TypeScript...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ⚠️ تحذير: مشاكل في TypeScript، لكن سنتابع...
)

echo.
echo 🚀 تشغيل الخادم...
echo.
echo ========================================
echo 🌐 المنصة ستكون متاحة على:
echo    http://localhost:3000
echo.
echo 🔑 بيانات تجريبية:
echo    طبيب: doctor@example.com / demo123
echo    مدير: admin@example.com / admin123
echo.
echo 📝 الميزات:
echo    - الاستشارات الطبية
echo    - المكالمات المرئية
echo    - المكتبة الطبية
echo    - نظام الرسائل
echo    - إدارة الأطباء
echo.
echo اضغط Ctrl+C لإيقاف الخادم
echo ========================================
echo.

start /b timeout /t 3 /nobreak >nul && start http://localhost:3000

call npm run dev

echo.
echo تم إيقاف النظام.
pause
