# 🚀 دليل رفع المشروع على GitHub وربطه مع Netlify

## 📋 الملفات المطلوبة للرفع

### ✅ الملفات الأساسية:
```
📦 المشروع/
├── 📁 src/                    # جميع ملفات الكود المصدري
├── 📁 public/                 # الملفات العامة والأيقونات
├── 📄 package.json            # تبعيات المشروع
├── 📄 package-lock.json       # قفل التبعيات
├── 📄 next.config.js          # إعدادات Next.js
├── 📄 tailwind.config.js      # إعدادات Tailwind
├── 📄 tsconfig.json           # إعدادات TypeScript
├── 📄 .eslintrc.json          # إعدادات ESLint
├── 📄 netlify.toml            # إعدادات Netlify (مهم!)
├── 📄 .nvmrc                  # إصدار Node.js
├── 📄 .gitignore              # ملفات مستبعدة
└── 📄 README.md               # دليل المشروع
```

### ❌ الملفات المستبعدة (في .gitignore):
- `node_modules/` - التبعيات
- `.next/` - ملفات البناء
- `out/` - مجلد الإخراج
- `.env.local` - متغيرات البيئة

## 🔧 خطوات الرفع على GitHub

### 1. إنشاء مستودع على GitHub
```bash
# اذهب إلى github.com
# انقر "New repository"
# اسم المستودع: medical-consultation-platform
# اختر Public أو Private
# لا تضيف README (موجود بالفعل)
```

### 2. رفع المشروع
```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Medical consultation platform"
git branch -M main
git remote add origin https://github.com/USERNAME/medical-consultation-platform.git
git push -u origin main
```

### 3. التحقق من الرفع
- ✅ تأكد من وجود جميع الملفات
- ✅ تأكد من وجود `netlify.toml`
- ✅ تأكد من عدم رفع `node_modules/`

## 🌐 ربط GitHub مع Netlify

### 1. إنشاء حساب Netlify
- اذهب إلى [netlify.com](https://netlify.com)
- سجل دخول بحساب GitHub

### 2. ربط المستودع
```
1. انقر "New site from Git"
2. اختر "GitHub"
3. اختر المستودع: medical-consultation-platform
4. اختر Branch: main
```

### 3. إعدادات البناء
```
Build command: npm ci && npm run build
Publish directory: out
```

### 4. متغيرات البيئة
```
NODE_VERSION: 18.17.0
NPM_VERSION: 9.6.7
NODE_ENV: production
NEXT_TELEMETRY_DISABLED: 1
```

## ⚙️ إعدادات Netlify التلقائية

بفضل ملف `netlify.toml`، ستتم قراءة الإعدادات تلقائياً:

```toml
[build]
  publish = "out"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18.17.0"
  NPM_VERSION = "9.6.7"
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"
```

## 🔄 النشر التلقائي

بعد الربط، كل push إلى GitHub سيؤدي إلى:
1. 🔄 بناء تلقائي على Netlify
2. 🚀 نشر تلقائي للموقع
3. 📧 إشعار بالنتيجة

## 🎯 النتيجة المتوقعة

### ✅ بعد النشر الناجح:
- 🌐 موقع متاح على: `https://YOUR-SITE-NAME.netlify.app`
- ⚡ سرعة تحميل عالية
- 📱 يعمل على جميع الأجهزة
- 🔒 SSL مجاني
- 🌍 CDN عالمي

## 🛠️ حل المشاكل الشائعة

### مشكلة: Build failed
**الحل:**
1. تحقق من Build logs في Netlify
2. تأكد من وجود `netlify.toml`
3. تأكد من إصدار Node.js (18+)

### مشكلة: Page not found
**الحل:**
1. تحقق من ملف `public/_redirects`
2. تأكد من `output: 'export'` في `next.config.js`

### مشكلة: Images not loading
**الحل:**
1. تأكد من `images: { unoptimized: true }`
2. استخدم مسارات نسبية للصور

## 📞 الدعم

- 📖 [Netlify Docs](https://docs.netlify.com)
- 📖 [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- 💬 [GitHub Issues](https://github.com/USERNAME/medical-consultation-platform/issues)

---

## 🎉 تهانينا!

بعد اتباع هذه الخطوات، ستحصل على:
- 🏥 منصة استشارات طبية مباشرة
- 🔄 نشر تلقائي مع كل تحديث
- 🌐 موقع سريع وآمن

**جاهز للانطلاق! 🚀**
