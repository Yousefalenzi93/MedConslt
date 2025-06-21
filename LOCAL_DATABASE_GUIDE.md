# 🗄️ دليل قاعدة البيانات المحلية المتقدمة

## 🎯 نظرة عامة

تم تطوير نظام قاعدة بيانات محلية متقدم للمنصة الطبية يدعم:

- ✅ **IndexedDB** للبيانات المعقدة
- ✅ **LocalStorage** كبديل آمن
- ✅ **نظام نسخ احتياطي متقدم**
- ✅ **مزامنة بين الأجهزة**
- ✅ **تحسين الأداء والفهرسة**
- ✅ **اختبارات شاملة**
- ✅ **دعم كامل لـ Netlify**

## 🚀 البدء السريع

### 1. التهيئة الأساسية

```typescript
import { initializeMedicalDB } from '@/lib/database';

// تهيئة قاعدة البيانات
const db = await initializeMedicalDB({
  autoBackup: true,
  backupInterval: 30 * 60 * 1000, // 30 دقيقة
  enableSync: false,
  enableOptimization: true,
  enableTesting: true
});

// الحصول على API
const api = db.getAPI();
```

### 2. استخدام الخدمة المتقدمة

```typescript
import { advancedDataService } from '@/services/advancedDataService';

// تهيئة الخدمة
await advancedDataService.initialize();

// إنشاء مستخدم جديد
const user = await advancedDataService.createUser({
  email: 'doctor@example.com',
  role: 'doctor',
  fullName: 'د. أحمد محمد'
});

// البحث عن الأطباء
const doctors = await advancedDataService.searchDoctors('أحمد', {
  specialty: 'طب عام'
});
```

## 📊 الميزات الرئيسية

### 🔍 البحث المتقدم

```typescript
// البحث النصي الذكي
const results = await db.getOptimizer().fullTextSearch(
  'consultations',
  'صداع',
  ['title', 'description'],
  { fuzzy: true, minScore: 0.5 }
);

// البحث بالفهارس
const doctors = await db.getOptimizer().optimizedSearch(
  'doctors',
  'specialty',
  'طب عام'
);
```

### 💾 النسخ الاحتياطي

```typescript
// إنشاء نسخة احتياطية كاملة
const backupId = await db.getBackupManager().createFullBackup();

// إنشاء نسخة تزايدية
const incrementalBackup = await db.getBackupManager().createIncrementalBackup();

// استعادة من نسخة احتياطية
await db.getBackupManager().restoreFromBackup(backupId, {
  clearExisting: true
});

// تصدير النسخة الاحتياطية
const blob = await db.getBackupManager().exportBackup(backupId);
```

### 🔄 المزامنة

```typescript
// تفعيل المزامنة
db.enableSync({
  endpoint: 'https://api.example.com',
  apiKey: 'your-api-key',
  userId: 'user-123',
  deviceId: 'device-456',
  syncInterval: 30000,
  conflictResolution: 'server'
});

// مزامنة فورية
await db.sync();

// الحصول على حالة المزامنة
const status = db.getSyncManager()?.getSyncStatus();
```

### ⚡ تحسين الأداء

```typescript
// بناء الفهارس
await db.getOptimizer().rebuildAllIndexes();

// تنظيف التخزين المؤقت
db.getOptimizer().cleanupCache();

// الحصول على إحصائيات الأداء
const metrics = db.getOptimizer().getPerformanceMetrics();
console.log(`معدل نجاح التخزين المؤقت: ${metrics.cacheHitRate}%`);
```

## 🧪 الاختبار

### تشغيل الاختبارات الشاملة

```typescript
// تشغيل جميع الاختبارات
await db.runTests();

// اختبار سريع
const passed = await db.getTester().runQuickTest();

// الحصول على تقرير مفصل
const report = db.getTester().getDetailedReport();
```

### اختبارات مخصصة

```typescript
const tester = db.getTester();

// اختبار إنشاء مستخدم
await tester.runTest('إنشاء مستخدم', async () => {
  const user = await api.createUser({
    email: 'test@example.com',
    role: 'patient'
  });
  return { userId: user.id };
});
```

## 📈 الإحصائيات والمراقبة

```typescript
// إحصائيات شاملة
const stats = await db.getStatistics();
console.log('إجمالي المستخدمين:', stats.database.totalUsers);
console.log('معدل الأداء:', stats.performance.averageQueryTime);

// إحصائيات النسخ الاحتياطي
const backups = await db.getBackupManager().getBackupsList();
console.log('عدد النسخ الاحتياطية:', backups.length);
```

## 🔧 التكوين المتقدم

### إعدادات قاعدة البيانات

```typescript
const config = {
  autoBackup: true,
  backupInterval: 60 * 60 * 1000, // ساعة واحدة
  enableSync: true,
  enableOptimization: true,
  enableTesting: process.env.NODE_ENV === 'development'
};

await initializeMedicalDB(config);
```

### إعدادات المزامنة

```typescript
const syncConfig = {
  endpoint: 'https://your-api.com/sync',
  apiKey: 'your-secret-key',
  userId: 'current-user-id',
  deviceId: 'unique-device-id',
  syncInterval: 30000, // 30 ثانية
  conflictResolution: 'manual' // 'client' | 'server' | 'manual'
};
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. فشل في التهيئة
```typescript
try {
  await db.initialize();
} catch (error) {
  console.error('فشل في التهيئة:', error);
  // إعادة المحاولة أو استخدام وضع الطوارئ
}
```

#### 2. مشاكل الأداء
```typescript
// تحسين قاعدة البيانات
await db.optimize();

// إعادة بناء الفهارس
await db.getOptimizer().rebuildAllIndexes();
```

#### 3. مشاكل المزامنة
```typescript
// إعادة تعيين المزامنة
db.getSyncManager()?.resetSync();

// التحقق من حالة الاتصال
const status = db.getSyncManager()?.getSyncStatus();
if (!status.isOnline) {
  console.log('غير متصل بالإنترنت');
}
```

## 📱 دعم Netlify

### إعدادات النشر

قاعدة البيانات تعمل بشكل مثالي مع Netlify:

- ✅ **Static Export**: تدعم التصدير الثابت
- ✅ **Client-Side**: تعمل بالكامل في المتصفح
- ✅ **No Server Required**: لا تحتاج خادم
- ✅ **Fast Loading**: تحميل سريع
- ✅ **Offline Support**: دعم العمل بدون اتصال

### ملف netlify.toml

```toml
[build]
  publish = "out"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18.17.0"
  NEXT_TELEMETRY_DISABLED = "1"
```

## 🔒 الأمان

### حماية البيانات

```typescript
// تشفير النسخ الاحتياطية
const backup = await db.getBackupManager().createFullBackup({
  encrypt: true,
  compress: true
});

// التحقق من سلامة البيانات
const isValid = await db.getBackupManager().validateBackup(backup);
```

### التحكم في الوصول

```typescript
// التحقق من صلاحيات المستخدم
const user = await api.getUserById(userId);
if (user.role !== 'admin') {
  throw new Error('غير مصرح');
}
```

## 📚 أمثلة عملية

### إنشاء استشارة طبية كاملة

```typescript
// 1. إنشاء المريض
const patient = await api.createUser({
  email: 'patient@example.com',
  role: 'patient',
  fullName: 'أحمد علي'
});

// 2. إنشاء الاستشارة
const consultation = await api.createConsultation({
  requesterId: patient.id,
  requesterName: patient.fullName,
  specialty: 'طب عام',
  title: 'استشارة طبية',
  description: 'أعاني من صداع مستمر',
  urgencyLevel: 'routine'
});

// 3. تعيين طبيب
const doctors = await api.getAvailableDoctors();
if (doctors.length > 0) {
  await api.assignConsultationToDoctor(
    consultation.id,
    doctors[0].id,
    doctors[0].fullName
  );
}

// 4. إرسال رسالة
await api.sendMessage({
  senderId: patient.id,
  senderName: patient.fullName,
  receiverId: doctors[0].userId,
  receiverName: doctors[0].fullName,
  content: 'مرحباً دكتور، أحتاج استشارة طبية'
});
```

## 🎯 أفضل الممارسات

1. **تهيئة مبكرة**: قم بتهيئة قاعدة البيانات في بداية التطبيق
2. **نسخ احتياطية منتظمة**: فعل النسخ الاحتياطي التلقائي
3. **مراقبة الأداء**: راقب إحصائيات الأداء بانتظام
4. **اختبار دوري**: شغل الاختبارات في بيئة التطوير
5. **تحسين دوري**: قم بتحسين قاعدة البيانات بانتظام

---

## 🎉 الخلاصة

نظام قاعدة البيانات المحلية المتقدم يوفر:

- 🚀 **أداء عالي** مع فهرسة ذكية
- 💾 **موثوقية** مع نسخ احتياطية تلقائية
- 🔄 **مزامنة** بين الأجهزة
- 🧪 **جودة** مع اختبارات شاملة
- 🌐 **توافق** كامل مع Netlify

**جاهز للاستخدام في الإنتاج! 🏥✨**
