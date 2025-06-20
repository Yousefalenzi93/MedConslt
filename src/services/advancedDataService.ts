// خدمة البيانات المتقدمة للمنصة الطبية
// تستخدم نظام قاعدة البيانات المحلية المتقدم

import { User, Doctor, ConsultationRequest, Message, VideoCall, Rating, SupportTicket, LibraryDocument, Notification } from '../types';
import { medicalDB, initializeMedicalDB } from '../lib/database';

// بيانات تجريبية للتهيئة الأولية
import usersData from '../data/users.json';
import consultationsData from '../data/consultations.json';
import messagesData from '../data/messages.json';
import ratingsData from '../data/ratings.json';
import supportData from '../data/support.json';
import libraryData from '../data/medical-library.json';

export class AdvancedDataService {
  private static instance: AdvancedDataService;
  private isInitialized = false;

  private constructor() {}

  // الحصول على المثيل الوحيد
  static getInstance(): AdvancedDataService {
    if (!AdvancedDataService.instance) {
      AdvancedDataService.instance = new AdvancedDataService();
    }
    return AdvancedDataService.instance;
  }

  // تهيئة الخدمة
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 تهيئة خدمة البيانات المتقدمة...');

    try {
      // تهيئة قاعدة البيانات
      await initializeMedicalDB({
        autoBackup: true,
        backupInterval: 30 * 60 * 1000, // 30 دقيقة
        enableSync: false,
        enableOptimization: true,
        enableTesting: process.env.NODE_ENV === 'development'
      });

      // تحميل البيانات التجريبية إذا لم تكن موجودة
      await this.seedInitialData();

      this.isInitialized = true;
      console.log('✅ تم تهيئة خدمة البيانات المتقدمة');

    } catch (error) {
      console.error('❌ فشل في تهيئة خدمة البيانات:', error);
      throw error;
    }
  }

  // === إدارة المستخدمين ===

  async getUsers(): Promise<User[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getAllUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getUserByEmail(email);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    await this.ensureInitialized();
    return medicalDB.getAPI().createUser(userData);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.getAPI().updateUser(id, updates);
  }

  // === إدارة الأطباء ===

  async getDoctors(): Promise<Doctor[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getAllUsers().then(users => 
      Promise.all(
        users
          .filter(user => user.role === 'doctor')
          .map(user => medicalDB.getAPI().getDoctorByUserId(user.id))
      )
    ).then(doctors => doctors.filter(Boolean) as Doctor[]);
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getDoctorById(id);
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getDoctorsBySpecialty(specialty);
  }

  async getAvailableDoctors(): Promise<Doctor[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getAvailableDoctors();
  }

  async createDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
    await this.ensureInitialized();
    return medicalDB.getAPI().createDoctor(doctorData);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.getAPI().updateDoctor(id, updates);
  }

  // === إدارة الاستشارات ===

  async getConsultations(): Promise<ConsultationRequest[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getAllUsers().then(() => 
      medicalDB.getAPI().getConsultationsByStatus('pending')
        .then(pending => 
          medicalDB.getAPI().getConsultationsByStatus('accepted')
            .then(accepted => 
              medicalDB.getAPI().getConsultationsByStatus('completed')
                .then(completed => [...pending, ...accepted, ...completed])
            )
        )
    );
  }

  async getConsultationById(id: string): Promise<ConsultationRequest | null> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getConsultationById(id);
  }

  async getConsultationsByUser(userId: string): Promise<ConsultationRequest[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getConsultationsByUser(userId);
  }

  async getConsultationsByDoctor(doctorId: string): Promise<ConsultationRequest[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getConsultationsByDoctor(doctorId);
  }

  async createConsultation(consultationData: Partial<ConsultationRequest>): Promise<ConsultationRequest> {
    await this.ensureInitialized();
    return medicalDB.getAPI().createConsultation(consultationData);
  }

  async updateConsultation(id: string, updates: Partial<ConsultationRequest>): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.getAPI().updateConsultation(id, updates);
  }

  async assignConsultationToDoctor(consultationId: string, doctorId: string, doctorName: string): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.getAPI().assignConsultationToDoctor(consultationId, doctorId, doctorName);
  }

  // === إدارة الرسائل ===

  async getMessages(): Promise<Message[]> {
    await this.ensureInitialized();
    // هذه طريقة مؤقتة - يجب تحسينها للحصول على جميع الرسائل
    const users = await medicalDB.getAPI().getAllUsers();
    const allMessages: Message[] = [];
    
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const messages = await medicalDB.getAPI().getMessagesByConversation(users[i].id, users[j].id);
        allMessages.push(...messages);
      }
    }
    
    return allMessages;
  }

  async getMessagesByConversation(userId1: string, userId2: string): Promise<Message[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getMessagesByConversation(userId1, userId2);
  }

  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    await this.ensureInitialized();
    return medicalDB.getAPI().sendMessage(messageData);
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.getAPI().markMessageAsRead(messageId);
  }

  // === البحث المتقدم ===

  async searchConsultations(query: string, filters?: any): Promise<ConsultationRequest[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().searchConsultations(query, filters);
  }

  async searchDoctors(query: string, filters?: any): Promise<Doctor[]> {
    await this.ensureInitialized();
    return medicalDB.getAPI().searchDoctors(query, filters);
  }

  // === الإحصائيات ===

  async getStatistics(): Promise<any> {
    await this.ensureInitialized();
    return medicalDB.getStatistics();
  }

  async getDashboardStats(): Promise<any> {
    await this.ensureInitialized();
    return medicalDB.getAPI().getStatistics();
  }

  // === النسخ الاحتياطي ===

  async createBackup(): Promise<string> {
    await this.ensureInitialized();
    return medicalDB.createBackup();
  }

  async getBackupsList(): Promise<any[]> {
    await this.ensureInitialized();
    return medicalDB.getBackupManager().getBackupsList();
  }

  async restoreFromBackup(backupId: string): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.restoreFromBackup(backupId);
  }

  // === التحسين ===

  async optimizeDatabase(): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.optimize();
  }

  async getPerformanceMetrics(): Promise<any> {
    await this.ensureInitialized();
    return medicalDB.getOptimizer().getPerformanceMetrics();
  }

  // === الاختبار ===

  async runTests(): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.runTests();
  }

  // === طرق مساعدة ===

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private async seedInitialData(): Promise<void> {
    try {
      // التحقق من وجود بيانات
      const existingUsers = await medicalDB.getAPI().getAllUsers();
      if (existingUsers.length > 0) {
        console.log('📊 البيانات موجودة بالفعل');
        return;
      }

      console.log('🌱 تحميل البيانات التجريبية...');

      // تحميل المستخدمين
      for (const userData of usersData) {
        await medicalDB.getAPI().createUser(userData);
      }

      // تحميل الأطباء
      const doctors = usersData.filter(user => user.role === 'doctor');
      for (const doctorUser of doctors) {
        await medicalDB.getAPI().createDoctor({
          userId: doctorUser.id,
          specialty: 'طب عام', // يمكن تخصيصه حسب البيانات
          fullName: doctorUser.fullName || doctorUser.email
        });
      }

      // تحميل الاستشارات
      for (const consultation of consultationsData) {
        await medicalDB.getAPI().createConsultation(consultation);
      }

      // تحميل الرسائل
      for (const message of messagesData) {
        await medicalDB.getAPI().sendMessage(message);
      }

      console.log('✅ تم تحميل البيانات التجريبية');

    } catch (error) {
      console.error('❌ فشل في تحميل البيانات التجريبية:', error);
    }
  }

  // إعادة تعيين البيانات
  async resetData(): Promise<void> {
    await this.ensureInitialized();
    await medicalDB.reset();
    this.isInitialized = false;
    await this.initialize();
  }

  // إغلاق الخدمة
  close(): void {
    if (this.isInitialized) {
      medicalDB.close();
      this.isInitialized = false;
    }
  }
}

// تصدير المثيل الوحيد
export const advancedDataService = AdvancedDataService.getInstance();

// دالة مساعدة للتهيئة السريعة
export async function initializeAdvancedDataService(): Promise<AdvancedDataService> {
  await advancedDataService.initialize();
  return advancedDataService;
}

// تصدير الخدمة كافتراضي للتوافق مع الكود الموجود
export default advancedDataService;
