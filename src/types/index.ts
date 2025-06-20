// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'doctor' | 'admin' | 'patient';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Doctor extends User {
  fullName: string;
  medicalLicenseNumber?: string;
  specialty: string;
  city?: string;
  workplace?: string;
  yearsOfExperience?: number;
  profilePhoto?: string;
  bio?: string;
  isLicenseVerified?: boolean;
  averageRating?: number;
  totalRatings?: number;
  totalConsultations?: number;
  isAvailable?: boolean;
  lastActiveAt: string;
}

export interface Admin extends User {
  fullName: string;
  permissions: string[];
}

// Consultation Types
export interface ConsultationRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  specialty: string;
  title: string;
  description: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  attachments: FileAttachment[];
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'rejected';
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  responseTime?: number; // in minutes
  completedAt?: string;
}

export interface ConsultationResponse {
  id: string;
  consultationId: string;
  doctorId: string;
  doctorName: string;
  response: string;
  attachments: FileAttachment[];
  isTemplate: boolean;
  templateName?: string;
  createdAt: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: number;
  uploadedAt: string;
}

// Video Consultation Types
export interface VideoCall {
  id: string;
  consultationId: string;
  doctorId: string;
  patientId: string;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number; // in minutes
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  recordingUrl?: string;
  isRecorded: boolean;
  consentGiven: boolean;
}

// Rating System Types
export interface ConsultationRating {
  id: string;
  consultationId: string;
  doctorId: string;
  raterId: string;
  raterName: string;
  accuracyRating: number; // 1-5
  communicationRating: number; // 1-5
  timelinessRating: number; // 1-5
  overallRating: number; // 1-5
  comment?: string;
  createdAt: string;
}

// Medical Library Types
export interface LibraryDocument {
  id: string;
  title: string;
  description: string;
  specialty: string;
  documentType: 'case-study' | 'research-article' | 'treatment-protocol' | 'guideline';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploaderName: string;
  version: number;
  averageRating: number;
  totalRatings: number;
  downloadCount: number;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRating {
  id: string;
  documentId: string;
  raterId: string;
  raterName: string;
  rating: number; // 1-5
  review?: string;
  isHelpful: boolean;
  createdAt: string;
}

// Support System Types
export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'technical' | 'account' | 'billing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  attachments: FileAttachment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  attachments: FileAttachment[];
  isInternal: boolean;
  createdAt: string;
}

// Messaging Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  attachments: FileAttachment[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: { [userId: string]: number };
  createdAt: string;
}

// Analytics Types
export interface DashboardMetrics {
  activeDoctors: number;
  totalConsultations: number;
  videoCallsCompleted: number;
  averageResponseTime: number;
  topSpecialties: SpecialtyMetric[];
  monthlyTrends: MonthlyMetric[];
  weeklyTrends: WeeklyMetric[];
}

export interface SpecialtyMetric {
  specialty: string;
  count: number;
  percentage: number;
}

export interface MonthlyMetric {
  month: string;
  consultations: number;
  videoCalls: number;
  newDoctors: number;
}

export interface WeeklyMetric {
  week: string;
  consultations: number;
  videoCalls: number;
  activeUsers: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'consultation' | 'video-call' | 'message' | 'rating' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface DoctorRegistrationForm {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  medicalLicenseNumber: string;
  specialty: string;
  city: string;
  workplace: string;
  yearsOfExperience: number;
  bio?: string;
}

export interface ConsultationForm {
  specialty: string;
  title: string;
  description: string;
  urgencyLevel: 'routine' | 'urgent' | 'emergency';
  attachments: File[];
}

// Constants
export const MEDICAL_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology',
  'Pathology',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Rheumatology',
  'Urology'
] as const;

export const SAUDI_CITIES = [
  'Riyadh',
  'Jeddah',
  'Mecca',
  'Medina',
  'Dammam',
  'Khobar',
  'Dhahran',
  'Taif',
  'Buraidah',
  'Tabuk',
  'Hail',
  'Abha',
  'Najran',
  'Jazan',
  'Yanbu',
  'Al Jubail',
  'Arar',
  'Sakaka',
  'Al Bahah',
  'Qatif'
] as const;
