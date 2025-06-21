# 🚀 دليل النشر على Netlify - منصة الاستشارات الطبية

## 📋 المتطلبات الأساسية

### 1. تثبيت Node.js محلياً
```bash
# تحميل وتثبيت Node.js 18.17.0 من:
https://nodejs.org/en/download/

# التحقق من التثبيت:
node --version  # يجب أن يظهر v18.17.0 أو أحدث
npm --version   # يجب أن يظهر 9.6.7 أو أحدث
```

### 2. تثبيت Git
```bash
# تحميل وتثبيت Git من:
https://git-scm.com/download/win

# التحقق من التثبيت:
git --version
```

## 🔧 خطوات النشر

### الطريقة الأولى: النشر المباشر

1. **تحضير المشروع محلياً:**
```bash
# في مجلد المشروع
npm install
npm run build
```

2. **رفع المجلد `out` مباشرة إلى Netlify:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - اسحب مجلد `out` إلى منطقة الرفع
   - سيتم نشر الموقع فوراً

### الطريقة الثانية: ربط GitHub (مُوصى بها)

1. **رفع المشروع إلى GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Medical consultation platform"
git branch -M main
git remote add origin https://github.com/username/medical-platform.git
git push -u origin main
```

2. **ربط Netlify بـ GitHub:**
   - اذهب إلى Netlify Dashboard
   - اضغط "New site from Git"
   - اختر GitHub واختر المستودع
   - استخدم الإعدادات التالية:
     - **Build command:** `npm ci && npm run build`
     - **Publish directory:** `out`
     - **Node version:** `18.17.0`

## ⚙️ إعدادات Netlify المحسنة

### متغيرات البيئة:
```
NODE_VERSION=18.17.0
NPM_VERSION=9.6.7
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
CI=true
```

### إعدادات البناء:
```toml
[build]
  publish = "out"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18.17.0"
  NPM_VERSION = "9.6.7"
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"
  CI = "true"
```

## 🔍 حل المشاكل الشائعة

### مشكلة: "npm not found"
**الحل:** تثبيت Node.js محلياً أولاً

### مشكلة: "Build failed"
**الحل:** 
1. تحقق من إصدار Node.js (18.17.0+)
2. امسح `node_modules` وأعد التثبيت
3. تأكد من عدم وجود أخطاء TypeScript

### مشكلة: "Page not found"
**الحل:** تحقق من ملف `_redirects` في مجلد `public`

## 📱 النتيجة المتوقعة

بعد النشر الناجح:
- ✅ موقع سريع ومتجاوب
- ✅ يعمل على جميع الأجهزة  
- ✅ تحديثات تلقائية مع GitHub
- ✅ SSL مجاني
- ✅ CDN عالمي

## 🎯 روابط مفيدة

- [Netlify Docs](https://docs.netlify.com)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Node.js Download](https://nodejs.org)

---

**تم تحسين الإعدادات للنشر الناجح! 🚀**
