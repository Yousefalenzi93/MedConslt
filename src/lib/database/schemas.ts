// مخططات قاعدة البيانات للمنصة الطبية
import { DBConfig } from './LocalDB';

// إعداد قاعدة البيانات الرئيسية
export const medicalDBConfig: DBConfig = {
  name: 'MedicalConsultationDB',
  version: 1,
  stores: [
    // جدول المستخدمين
    {
      name: 'users',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'email', keyPath: 'email', unique: true },
        { name: 'role', keyPath: 'role' },
        { name: 'isActive', keyPath: 'isActive' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول الأطباء (معلومات إضافية)
    {
      name: 'doctors',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId', unique: true },
        { name: 'specialty', keyPath: 'specialty' },
        { name: 'city', keyPath: 'city' },
        { name: 'isVerified', keyPath: 'isLicenseVerified' },
        { name: 'isAvailable', keyPath: 'isAvailable' },
        { name: 'rating', keyPath: 'averageRating' }
      ]
    },

    // جدول الاستشارات
    {
      name: 'consultations',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'requesterId', keyPath: 'requesterId' },
        { name: 'doctorId', keyPath: 'assignedDoctorId' },
        { name: 'status', keyPath: 'status' },
        { name: 'specialty', keyPath: 'specialty' },
        { name: 'urgency', keyPath: 'urgencyLevel' },
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'updatedAt', keyPath: 'updatedAt' }
      ]
    },

    // جدول الرسائل
    {
      name: 'messages',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'senderId', keyPath: 'senderId' },
        { name: 'receiverId', keyPath: 'receiverId' },
        { name: 'conversationId', keyPath: 'conversationId' },
        { name: 'isRead', keyPath: 'isRead' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول المحادثات
    {
      name: 'conversations',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'participants', keyPath: 'participants', unique: false },
        { name: 'lastMessageAt', keyPath: 'lastMessageAt' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول مكالمات الفيديو
    {
      name: 'videoCalls',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'consultationId', keyPath: 'consultationId' },
        { name: 'doctorId', keyPath: 'doctorId' },
        { name: 'patientId', keyPath: 'patientId' },
        { name: 'status', keyPath: 'status' },
        { name: 'scheduledAt', keyPath: 'scheduledAt' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول المرفقات
    {
      name: 'attachments',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'consultationId', keyPath: 'consultationId' },
        { name: 'messageId', keyPath: 'messageId' },
        { name: 'uploaderId', keyPath: 'uploaderId' },
        { name: 'type', keyPath: 'type' },
        { name: 'uploadedAt', keyPath: 'uploadedAt' }
      ]
    },

    // جدول التقييمات
    {
      name: 'ratings',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'consultationId', keyPath: 'consultationId', unique: true },
        { name: 'doctorId', keyPath: 'doctorId' },
        { name: 'patientId', keyPath: 'patientId' },
        { name: 'rating', keyPath: 'rating' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول المكتبة الطبية
    {
      name: 'libraryDocuments',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'specialty', keyPath: 'specialty' },
        { name: 'documentType', keyPath: 'documentType' },
        { name: 'uploadedBy', keyPath: 'uploadedBy' },
        { name: 'isPublic', keyPath: 'isPublic' },
        { name: 'rating', keyPath: 'averageRating' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول تذاكر الدعم
    {
      name: 'supportTickets',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'category', keyPath: 'category' },
        { name: 'priority', keyPath: 'priority' },
        { name: 'status', keyPath: 'status' },
        { name: 'assignedTo', keyPath: 'assignedTo' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول الإشعارات
    {
      name: 'notifications',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'type', keyPath: 'type' },
        { name: 'isRead', keyPath: 'isRead' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول الجلسات
    {
      name: 'sessions',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'isActive', keyPath: 'isActive' },
        { name: 'createdAt', keyPath: 'createdAt' },
        { name: 'expiresAt', keyPath: 'expiresAt' }
      ]
    },

    // جدول الإعدادات
    {
      name: 'settings',
      keyPath: 'key',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'category', keyPath: 'category' },
        { name: 'updatedAt', keyPath: 'updatedAt' }
      ]
    },

    // جدول السجلات (Logs)
    {
      name: 'logs',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'userId', keyPath: 'userId' },
        { name: 'action', keyPath: 'action' },
        { name: 'level', keyPath: 'level' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    },

    // جدول النسخ الاحتياطي
    {
      name: 'backups',
      keyPath: 'id',
      autoIncrement: false,
      indexes: [
        { name: 'type', keyPath: 'type' },
        { name: 'status', keyPath: 'status' },
        { name: 'createdAt', keyPath: 'createdAt' }
      ]
    }
  ]
};

// مخططات البيانات للتحقق من صحة البيانات
export const dataSchemas = {
  user: {
    required: ['id', 'email', 'role', 'createdAt'],
    optional: ['fullName', 'isActive', 'updatedAt', 'lastLoginAt']
  },

  doctor: {
    required: ['id', 'userId', 'specialty', 'fullName'],
    optional: ['medicalLicenseNumber', 'city', 'workplace', 'yearsOfExperience', 
               'profilePhoto', 'bio', 'isLicenseVerified', 'averageRating', 
               'totalRatings', 'totalConsultations', 'isAvailable', 'lastActiveAt']
  },

  consultation: {
    required: ['id', 'requesterId', 'requesterName', 'specialty', 'title', 
               'description', 'urgencyLevel', 'status', 'createdAt'],
    optional: ['assignedDoctorId', 'assignedDoctorName', 'rejectionReason', 
               'updatedAt', 'responseTime', 'completedAt', 'attachments']
  },

  message: {
    required: ['id', 'senderId', 'senderName', 'receiverId', 'receiverName', 
               'content', 'createdAt'],
    optional: ['conversationId', 'attachments', 'isRead', 'readAt']
  },

  videoCall: {
    required: ['id', 'consultationId', 'doctorId', 'patientId', 'status', 'createdAt'],
    optional: ['scheduledAt', 'startedAt', 'endedAt', 'duration', 'quality', 'notes']
  },

  rating: {
    required: ['id', 'consultationId', 'doctorId', 'patientId', 'rating', 'createdAt'],
    optional: ['comment', 'categories']
  },

  libraryDocument: {
    required: ['id', 'title', 'specialty', 'documentType', 'uploadedBy', 'createdAt'],
    optional: ['description', 'fileUrl', 'fileName', 'fileSize', 'version', 
               'averageRating', 'totalRatings', 'downloadCount', 'tags', 'isPublic']
  },

  supportTicket: {
    required: ['id', 'userId', 'category', 'priority', 'subject', 'description', 
               'status', 'createdAt'],
    optional: ['assignedTo', 'attachments', 'updatedAt', 'resolvedAt']
  },

  notification: {
    required: ['id', 'userId', 'type', 'title', 'message', 'createdAt'],
    optional: ['data', 'isRead', 'readAt']
  }
};

// قواعد التحقق من صحة البيانات
export const validationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  medicalLicense: /^[A-Z0-9]{6,20}$/,
  rating: (value: number) => value >= 1 && value <= 5,
  urgencyLevel: ['routine', 'urgent', 'emergency'],
  consultationStatus: ['pending', 'accepted', 'in-progress', 'completed', 'rejected'],
  userRoles: ['doctor', 'admin', 'patient'],
  documentTypes: ['case-study', 'research-article', 'treatment-protocol', 'guideline'],
  supportCategories: ['technical', 'account', 'billing', 'other'],
  supportPriorities: ['low', 'medium', 'high', 'critical'],
  notificationTypes: ['consultation', 'video-call', 'message', 'rating', 'system']
};

// فهارس البحث المتقدم
export const searchIndexes = {
  consultations: {
    fullText: ['title', 'description', 'specialty'],
    filters: ['status', 'urgencyLevel', 'specialty', 'assignedDoctorId']
  },
  
  doctors: {
    fullText: ['fullName', 'specialty', 'bio', 'workplace'],
    filters: ['specialty', 'city', 'isAvailable', 'isLicenseVerified']
  },
  
  libraryDocuments: {
    fullText: ['title', 'description', 'tags'],
    filters: ['specialty', 'documentType', 'isPublic']
  },
  
  messages: {
    fullText: ['content'],
    filters: ['senderId', 'receiverId', 'isRead']
  }
};

// إعدادات الأداء
export const performanceConfig = {
  cacheSize: 1000, // عدد السجلات المحفوظة في الذاكرة
  indexCacheSize: 500, // عدد نتائج البحث المحفوظة
  batchSize: 100, // حجم الدفعة للعمليات المجمعة
  syncInterval: 30000, // فترة المزامنة بالميلي ثانية (30 ثانية)
  backupInterval: 3600000, // فترة النسخ الاحتياطي (ساعة واحدة)
  maxBackups: 10 // عدد النسخ الاحتياطية المحفوظة
};
