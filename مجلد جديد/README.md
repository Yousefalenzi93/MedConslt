# منصة الاستشارات الطبية 🏥

## Medical Consultation Platform

منصة شاملة للاستشارات الطبية والتواصل بين الأطباء مع مكالمات مرئية عالية الجودة ومكتبة طبية تفاعلية.

## 🚀 النشر على Netlify

### خطوات النشر الصحيحة:

1. **ارفع المشروع إلى GitHub**
2. **في Netlify**: "New site from Git"
3. **اضبط الإعدادات**:
   - Build command: `npm ci && npm run build`
   - Publish directory: `out`
   - Node version: `18`

**النتيجة**: https://mtmconsult.netlify.app

### إعدادات Netlify المطلوبة:
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `out`
- **Base directory:** (فارغ)
- **Node version:** `18`

## 🔑 بيانات الاختبار

### حساب طبيب:
- **البريد**: `doctor@example.com`
- **المرور**: `demo123`

### حساب مدير:
- **البريد**: `admin@example.com`
- **المرور**: `admin123`

## 📋 الميزات

- ✅ **واجهة عربية كاملة** مع دعم RTL
- ✅ **نظام الاستشارات الطبية** الشامل
- ✅ **المكالمات المرئية** عبر WebRTC
- ✅ **المكتبة الطبية** التفاعلية
- ✅ **نظام المراسلة** الآمن
- ✅ **تقييم الأطباء** متعدد المعايير
- ✅ **لوحة تحكم إدارية** شاملة
- ✅ **تصميم متجاوب** لجميع الأجهزة

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 14, TypeScript, React 18
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Video Calls**: WebRTC, Simple Peer
- **Deployment**: Netlify

## 📁 هيكل المشروع

```
medical-consultation-platform/
├── out/                    # ملفات النشر الجاهزة
│   ├── index.html         # الصفحة الرئيسية
│   ├── dashboard/         # لوحة التحكم
│   └── _redirects         # إعدادات التوجيه
├── src/                   # الكود المصدري
├── public/               # الملفات العامة
└── docs/                 # التوثيق
```

## 🚀 التشغيل المحلي

```bash
# تثبيت التبعيات
npm install

# تشغيل الخادم المحلي
npm run dev

# فتح المتصفح على
http://localhost:3000
```

## 📖 التوثيق

- [تعليمات النشر](./DEPLOY_STATIC.md)
- [دليل التشغيل السريع](./نشر_مباشر_بدون_بناء.txt)
- [حل المشاكل](./حل_مشكلة_البناء.txt)

## ⚠️ ملاحظات

- هذه نسخة تجريبية للعرض والاختبار
- البيانات محفوظة محلياً في المتصفح
- للنسخة الإنتاجية، يتطلب إعداد Firebase حقيقي

## 📞 الدعم

للمساعدة في النشر أو التشغيل، راجع ملفات التوثيق المرفقة.

---

**تم تطوير النظام باستخدام أحدث التقنيات لضمان الأمان والكفاءة** 🚀
