# 🏥 منصة الاستشارات الطبية المتطورة

منصة شاملة للاستشارات الطبية مع الذكاء الاصطناعي ومكالمات الفيديو عالية الجودة.

## ✨ الميزات الرئيسية

- 🩺 **استشارات طبية فورية** - تواصل مع أطباء معتمدين 24/7
- 🤖 **مساعد ذكي بالذكاء الاصطناعي** - إرشاد طبي ذكي ومتطور
- 📹 **مكالمات فيديو عالية الجودة** - تقنية WebRTC آمنة ومشفرة
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة
- 🔒 **أمان متقدم** - حماية كاملة للبيانات الطبية
- 📊 **تحليلات متقدمة** - إحصائيات شاملة للأطباء والإدارة

## 🚀 التقنيات المستخدمة

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Icons**: Heroicons
- **Forms**: React Hook Form, Zod
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Deployment**: Netlify (Static Export)

## 📋 المتطلبات

- Node.js 18.17.0 أو أحدث
- npm 9.6.7 أو أحدث

## 🛠️ التثبيت والتشغيل

### 1. تحميل المشروع
```bash
git clone <repository-url>
cd medical-consultation-platform
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. تشغيل المشروع محلياً
```bash
npm run dev
```

### 4. بناء المشروع للإنتاج
```bash
npm run build
```

### 5. اختبار البناء
```bash
# على Windows
.\test-build.ps1

# على Linux/Mac
node test-build.js
```

## 🌐 النشر على Netlify

### الطريقة الأولى: النشر المباشر
1. شغل `npm run build`
2. ارفع مجلد `out` إلى Netlify

### الطريقة الثانية: ربط GitHub (مُوصى بها)
1. ارفع المشروع إلى GitHub
2. اربط Netlify بـ GitHub
3. استخدم الإعدادات من `netlify.toml`

## 📁 هيكل المشروع

```
src/
├── app/                 # صفحات Next.js App Router
├── components/          # مكونات React قابلة للإعادة
├── contexts/           # React Contexts
├── data/               # ملفات البيانات التجريبية
├── lib/                # مكتبات مساعدة
├── services/           # خدمات البيانات
└── types/              # تعريفات TypeScript
```

## 🔧 السكريبتات المتاحة

- `npm run dev` - تشغيل المشروع في وضع التطوير
- `npm run build` - بناء المشروع للإنتاج
- `npm run start` - تشغيل المشروع المبني
- `npm run lint` - فحص الكود بـ ESLint
- `npm run type-check` - فحص أخطاء TypeScript

## 🎯 الحسابات التجريبية

### طبيب
- **البريد**: doctor@example.com
- **كلمة المرور**: demo123

### مدير النظام
- **البريد**: admin@example.com
- **كلمة المرور**: admin123

### مريض
- **البريد**: patient1@example.com
- **كلمة المرور**: patient123

## 📚 الوثائق

- [دليل النشر على Netlify](./NETLIFY_DEPLOY_GUIDE.md)
- [تعليمات البناء](./مجلد جديد/BUILD_INSTRUCTIONS.md)
- [الميزات المتقدمة](./مجلد جديد/ADVANCED_FEATURES.md)

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء.

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للحصول على الدعم، يرجى فتح issue في GitHub أو التواصل معنا.

---

**تم تطوير هذا المشروع بعناية لتوفير أفضل تجربة للاستشارات الطبية الرقمية** 🏥✨
