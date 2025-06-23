// Application constants
export const APP_CONFIG = {
  name: 'منصة الاستشارات الطبية',
  version: '1.0.0',
  description: 'تطبيق ويب احترافي لإدارة الاستشارات الطبية',
  author: 'Medical Consult Team',
  supportEmail: 'support@medical-consult.com',
  website: 'https://medical-consult.netlify.app'
}

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  consultations: {
    list: '/consultations',
    create: '/consultations',
    get: (id) => `/consultations/${id}`,
    update: (id) => `/consultations/${id}`,
    delete: (id) => `/consultations/${id}`
  },
  messages: {
    list: (conversationId) => `/messages/${conversationId}`,
    send: '/messages',
    markRead: (id) => `/messages/${id}/read`
  },
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    avatar: '/users/avatar',
    doctors: '/users/doctors',
    patients: '/users/patients'
  },
  library: {
    articles: '/library/articles',
    article: (id) => `/library/articles/${id}`,
    bookmark: (id) => `/library/articles/${id}/bookmark`,
    categories: '/library/categories'
  },
  analytics: {
    overview: '/analytics',
    consultations: '/analytics/consultations',
    revenue: '/analytics/revenue',
    patients: '/analytics/patients'
  },
  notifications: {
    list: '/notifications',
    markRead: (id) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read'
  }
}

export const USER_TYPES = {
  DOCTOR: 'doctor',
  PATIENT: 'patient'
}

export const CONSULTATION_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  VOICE: 'voice'
}

export const NOTIFICATION_TYPES = {
  NEW_CONSULTATION: 'new_consultation',
  MESSAGE_RECEIVED: 'message_received',
  CONSULTATION_COMPLETED: 'consultation_completed',
  APPOINTMENT_REMINDER: 'appointment_reminder',
  PAYMENT_RECEIVED: 'payment_received'
}

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency'
}

export const MEDICAL_SPECIALTIES = [
  'طب عام',
  'طب الأطفال',
  'طب النساء والولادة',
  'طب القلب',
  'طب الأعصاب',
  'طب العيون',
  'طب الأسنان',
  'طب الجلدية',
  'طب العظام',
  'الطب النفسي',
  'طب الأنف والأذن والحنجرة',
  'طب المسالك البولية',
  'طب الجهاز الهضمي',
  'طب الغدد الصماء',
  'طب الروماتيزم',
  'طب الطوارئ',
  'طب الأشعة',
  'طب التخدير',
  'طب الأورام',
  'طب الكلى'
]

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' }
]

export const THEME_OPTIONS = [
  { value: 'light', label: 'فاتح' },
  { value: 'dark', label: 'داكن' },
  { value: 'auto', label: 'تلقائي' }
]

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm'
}

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+966|0)?[5-9]\d{8}$/,
  password: {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false
  }
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  CONSULTATIONS_CACHE: 'consultations_cache',
  MESSAGES_CACHE: 'messages_cache',
  SETTINGS: 'user_settings'
}

export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
}

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
}

export const FEATURE_FLAGS = {
  AI_ASSISTANT: import.meta.env.VITE_ENABLE_AI_ASSISTANT === 'true',
  REAL_TIME_MESSAGING: import.meta.env.VITE_ENABLE_REAL_TIME_MESSAGING === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true'
}
