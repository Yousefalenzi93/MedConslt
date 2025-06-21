# نشر منصة الاستشارات الطبية على Netlify

## 🚀 خطوات النشر على https://mtmconsult.netlify.app

### ⚡ الطريقة الأسرع: النشر المباشر (مُوصى بها)

**مجلد `out` جاهز للنشر الفوري!**

1. **رفع مجلد `out` إلى Netlify:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - سجل الدخول إلى حسابك
   - انقر "Deploy manually"
   - اسحب مجلد `medical-consultation-platform/out/` إلى منطقة الرفع
   - انتظر حتى يكتمل الرفع (دقيقة واحدة تقريباً)
   - غير اسم الموقع إلى "mtmconsult"

**لا تحتاج لعملية بناء - الملفات جاهزة!**

### الطريقة الثانية: ربط مع GitHub (مُوصى بها)

1. **رفع المشروع إلى GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Medical Consultation Platform"
   git branch -M main
   git remote add origin [YOUR_GITHUB_REPO_URL]
   git push -u origin main
   ```

2. **ربط Netlify مع GitHub:**
   - اذهب إلى Netlify Dashboard
   - انقر "New site from Git"
   - اختر GitHub
   - اختر المستودع
   - اضبط الإعدادات:
     - **Build command:** `npm run build`
     - **Publish directory:** `out`
     - **Node version:** `18`

### الطريقة الثالثة: Netlify CLI

1. **تثبيت Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **تسجيل الدخول:**
   ```bash
   netlify login
   ```

3. **بناء ونشر المشروع:**
   ```bash
   npm run build
   netlify deploy --prod --dir=out
   ```

## ⚙️ إعدادات Netlify

### متغيرات البيئة (Environment Variables)
في Netlify Dashboard > Site settings > Environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### إعدادات البناء (Build Settings)
```
Build command: npm run build
Publish directory: out
Node version: 18
```

## 🔧 ملفات الإعداد المضافة

- `netlify.toml` - إعدادات Netlify الرئيسية
- `public/_redirects` - إعادة توجيه الصفحات
- `next.config.js` - محدث للتصدير الثابت

## 🌐 الوصول للموقع

بعد النشر الناجح:
- **الرابط:** https://mtmconsult.netlify.app
- **بيانات الدخول التجريبية:**
  - طبيب: `doctor@example.com` / `demo123`
  - مدير: `admin@example.com` / `admin123`

## 📱 الميزات المتاحة على الموقع

✅ واجهة عربية كاملة مع دعم RTL  
✅ تصميم متجاوب لجميع الأجهزة  
✅ نظام الاستشارات الطبية  
✅ المكتبة الطبية التفاعلية  
✅ نظام المراسلة (محاكاة)  
✅ لوحة تحكم الإدارة  
✅ تقييم الأطباء والخدمات  

## ⚠️ ملاحظات مهمة

### للنسخة التجريبية:
- النظام يعمل بدون Firebase (محاكاة)
- البيانات محفوظة في localStorage
- جميع الميزات متاحة للاختبار

### للنسخة الإنتاجية:
- يتطلب إعداد Firebase حقيقي
- إضافة متغيرات البيئة في Netlify
- تفعيل Firebase Authentication
- إعداد Firestore Database

## 🔄 التحديثات التلقائية

عند ربط GitHub مع Netlify:
- كل push إلى main branch يؤدي لنشر تلقائي
- Preview deployments للـ pull requests
- إشعارات البناء والنشر

## 🛠️ استكشاف الأخطاء

### خطأ في البناء:
```bash
# تنظيف وإعادة البناء
npm run clean
npm install
npm run build
```

### مشكلة في الصور:
- تأكد من `unoptimized: true` في next.config.js
- استخدم مسارات نسبية للصور

### مشكلة في التوجيه:
- تحقق من ملف `_redirects`
- تأكد من `trailingSlash: true` في next.config.js

## 📞 الدعم

للمساعدة في النشر:
1. راجع [Netlify Docs](https://docs.netlify.com)
2. تحقق من Build logs في Netlify Dashboard
3. تأكد من إعدادات Node.js version

---

**النظام جاهز للنشر على https://mtmconsult.netlify.app! 🚀**
