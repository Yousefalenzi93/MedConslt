# دليل إعداد Firebase لمنصة الاستشارات الطبية

## 🔥 إعداد Firebase خطوة بخطوة

### 1️⃣ إنشاء مشروع Firebase

1. **اذهب إلى** [Firebase Console](https://console.firebase.google.com/)
2. **انقر** "Create a project"
3. **اسم المشروع:** `medical-consultation-platform`
4. **فعّل Google Analytics** (اختياري)
5. **انقر** "Create project"

### 2️⃣ إعداد Authentication

```
Firebase Console > Authentication > Get started
```

**طرق تسجيل الدخول المطلوبة:**
- ✅ **Email/Password** (مطلوب)
- ✅ **Google** (اختياري)
- ✅ **Phone** (للمرضى - اختياري)

**إعدادات إضافية:**
- **Authorized domains:** أضف نطاق موقعك
- **Email templates:** خصص رسائل البريد الإلكتروني

### 3️⃣ إعداد Firestore Database

```
Firebase Console > Firestore Database > Create database
```

**الإعدادات:**
- **Mode:** Start in test mode (للتطوير)
- **Location:** europe-west (أو الأقرب لك)

**قواعد الأمان الأولية:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4️⃣ إعداد Storage

```
Firebase Console > Storage > Get started
```

**الإعدادات:**
- **Mode:** Start in test mode
- **Location:** نفس موقع Firestore

**قواعد الأمان:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5️⃣ إضافة تطبيق الويب

```
Project Overview > Add app > Web (</> icon)
```

**الإعدادات:**
- **App nickname:** Medical Consultation Web App
- **Firebase Hosting:** فعّل إذا كنت تريد استخدامه

### 6️⃣ نسخ إعدادات Firebase

ستحصل على كود مثل:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "medical-consultation-platform.firebaseapp.com",
  projectId: "medical-consultation-platform",
  storageBucket: "medical-consultation-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 7️⃣ تحديث ملف .env.local

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=medical-consultation-platform.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=medical-consultation-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=medical-consultation-platform.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 8️⃣ إعداد Firebase Admin (للخادم)

1. **اذهب إلى** Project Settings > Service accounts
2. **انقر** "Generate new private key"
3. **احفظ الملف** وأضف المتغيرات:

```env
FIREBASE_ADMIN_PROJECT_ID=medical-consultation-platform
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@medical-consultation-platform.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## 🗂️ هيكل قاعدة البيانات المقترح

### Collections الرئيسية:

```
/users/{userId}
  - email: string
  - fullName: string
  - role: 'doctor' | 'patient' | 'admin'
  - specialization?: string
  - phone?: string
  - avatar?: string
  - isActive: boolean
  - createdAt: timestamp

/consultations/{consultationId}
  - patientId: string
  - doctorId: string
  - title: string
  - description: string
  - status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  - priority: 'low' | 'medium' | 'high' | 'urgent'
  - specialization: string
  - createdAt: timestamp
  - updatedAt: timestamp

/messages/{messageId}
  - consultationId: string
  - senderId: string
  - content: string
  - type: 'text' | 'image' | 'file'
  - fileUrl?: string
  - createdAt: timestamp

/medical-library/{documentId}
  - title: string
  - description: string
  - category: string
  - fileUrl: string
  - uploadedBy: string
  - downloads: number
  - rating: number
  - createdAt: timestamp

/ratings/{ratingId}
  - doctorId: string
  - patientId: string
  - consultationId: string
  - rating: number (1-5)
  - comment?: string
  - createdAt: timestamp
```

## 🔒 قواعد الأمان المتقدمة

### Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        (resource.data.role == 'doctor' || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Consultations
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.patientId || 
         request.auth.uid == resource.data.doctorId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Medical Library
    match /medical-library/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['doctor', 'admin'];
    }
    
    // Ratings
    match /ratings/{ratingId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.patientId;
    }
  }
}
```

## 🚀 اختبار الإعداد

### 1. تشغيل النظام محلي<|im_start|>:
```bash
npm run dev
```

### 2. اختبار Authentication:
- تسجيل حساب جديد
- تسجيل الدخول
- تسجيل الخروج

### 3. اختبار Firestore:
- إنشاء استشارة جديدة
- قراءة البيانات
- تحديث البيانات

### 4. اختبار Storage:
- رفع صورة شخصية
- رفع ملف طبي

## ⚠️ ملاحظات أمنية مهمة

1. **لا تشارك** مفاتيح Firebase Admin
2. **استخدم قواعد أمان صارمة** في الإنتاج
3. **فعّل App Check** للحماية من البوتات
4. **راقب الاستخدام** في Firebase Console
5. **استخدم HTTPS** دائماً في الإنتاج

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع [Firebase Documentation](https://firebase.google.com/docs)
2. تحقق من Console logs
3. راجع Firebase Console للأخطاء

---

**Firebase جاهز الآن لمنصة الاستشارات الطبية! 🔥**
