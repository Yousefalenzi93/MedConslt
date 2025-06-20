// واجهة برمجية شاملة للمنصة الطبية
import { LocalDB, QueryOptions } from './LocalDB';
import { medicalDBConfig, dataSchemas, validationRules } from './schemas';
import { User, Doctor, ConsultationRequest, Message, VideoCall, Rating, FileAttachment } from '../../types';

export class MedicalAPI {
  private db: LocalDB;
  private cache: Map<string, any> = new Map();
  private isInitialized = false;

  constructor() {
    this.db = new LocalDB(medicalDBConfig);
  }

  // تهيئة قاعدة البيانات
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    await this.db.initialize();
    await this.seedInitialData();
    this.isInitialized = true;
    
    console.log('🏥 تم تهيئة API المنصة الطبية بنجاح');
  }

  // === إدارة المستخدمين ===

  async createUser(userData: Partial<User>): Promise<User> {
    this.validateData('user', userData);
    
    const user: User = {
      id: this.generateId(),
      email: userData.email!,
      role: userData.role!,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...userData
    };

    await this.db.add('users', user);
    this.clearCache('users');
    
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const cacheKey = `user_${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const user = await this.db.get<User>('users', id);
    if (user) {
      this.cache.set(cacheKey, user);
    }
    
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.findByIndex<User>('users', 'email', email);
    return users[0] || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const user = await this.getUserById(id);
    if (!user) throw new Error('المستخدم غير موجود');

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.db.update('users', updatedUser);
    this.cache.set(`user_${id}`, updatedUser);
    this.clearCache('users');
  }

  async getAllUsers(options?: QueryOptions): Promise<User[]> {
    return this.db.getAll<User>('users', options);
  }

  // === إدارة الأطباء ===

  async createDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
    this.validateData('doctor', doctorData);
    
    const doctor: Doctor = {
      id: this.generateId(),
      userId: doctorData.userId!,
      specialty: doctorData.specialty!,
      fullName: doctorData.fullName!,
      isLicenseVerified: false,
      averageRating: 0,
      totalRatings: 0,
      totalConsultations: 0,
      isAvailable: true,
      lastActiveAt: new Date().toISOString(),
      ...doctorData
    };

    await this.db.add('doctors', doctor);
    this.clearCache('doctors');
    
    return doctor;
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.db.get<Doctor>('doctors', id);
  }

  async getDoctorByUserId(userId: string): Promise<Doctor | null> {
    const doctors = await this.db.findByIndex<Doctor>('doctors', 'userId', userId);
    return doctors[0] || null;
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.db.findByIndex<Doctor>('doctors', 'specialty', specialty);
  }

  async getAvailableDoctors(): Promise<Doctor[]> {
    return this.db.findByIndex<Doctor>('doctors', 'isAvailable', true);
  }

  async updateDoctorRating(doctorId: string, newRating: number): Promise<void> {
    const doctor = await this.getDoctorById(doctorId);
    if (!doctor) throw new Error('الطبيب غير موجود');

    const totalRatings = doctor.totalRatings || 0;
    const currentAverage = doctor.averageRating || 0;
    
    const newTotal = totalRatings + 1;
    const newAverage = ((currentAverage * totalRatings) + newRating) / newTotal;

    await this.updateDoctor(doctorId, {
      averageRating: Math.round(newAverage * 100) / 100,
      totalRatings: newTotal
    });
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<void> {
    const doctor = await this.getDoctorById(id);
    if (!doctor) throw new Error('الطبيب غير موجود');

    const updatedDoctor = {
      ...doctor,
      ...updates,
      lastActiveAt: new Date().toISOString()
    };

    await this.db.update('doctors', updatedDoctor);
    this.clearCache('doctors');
  }

  // === إدارة الاستشارات ===

  async createConsultation(consultationData: Partial<ConsultationRequest>): Promise<ConsultationRequest> {
    this.validateData('consultation', consultationData);
    
    const consultation: ConsultationRequest = {
      id: this.generateId(),
      requesterId: consultationData.requesterId!,
      requesterName: consultationData.requesterName!,
      specialty: consultationData.specialty!,
      title: consultationData.title!,
      description: consultationData.description!,
      urgencyLevel: consultationData.urgencyLevel!,
      attachments: consultationData.attachments || [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...consultationData
    };

    await this.db.add('consultations', consultation);
    this.clearCache('consultations');
    
    return consultation;
  }

  async getConsultationById(id: string): Promise<ConsultationRequest | null> {
    return this.db.get<ConsultationRequest>('consultations', id);
  }

  async getConsultationsByUser(userId: string): Promise<ConsultationRequest[]> {
    return this.db.findByIndex<ConsultationRequest>('consultations', 'requesterId', userId);
  }

  async getConsultationsByDoctor(doctorId: string): Promise<ConsultationRequest[]> {
    return this.db.findByIndex<ConsultationRequest>('consultations', 'doctorId', doctorId);
  }

  async getConsultationsByStatus(status: string): Promise<ConsultationRequest[]> {
    return this.db.findByIndex<ConsultationRequest>('consultations', 'status', status);
  }

  async assignConsultationToDoctor(consultationId: string, doctorId: string, doctorName: string): Promise<void> {
    const consultation = await this.getConsultationById(consultationId);
    if (!consultation) throw new Error('الاستشارة غير موجودة');

    await this.updateConsultation(consultationId, {
      assignedDoctorId: doctorId,
      assignedDoctorName: doctorName,
      status: 'accepted'
    });
  }

  async updateConsultationStatus(consultationId: string, status: string, notes?: string): Promise<void> {
    const updates: Partial<ConsultationRequest> = {
      status: status as any,
      updatedAt: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.completedAt = new Date().toISOString();
    }

    if (status === 'rejected' && notes) {
      updates.rejectionReason = notes;
    }

    await this.updateConsultation(consultationId, updates);
  }

  async updateConsultation(id: string, updates: Partial<ConsultationRequest>): Promise<void> {
    const consultation = await this.getConsultationById(id);
    if (!consultation) throw new Error('الاستشارة غير موجودة');

    const updatedConsultation = {
      ...consultation,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.db.update('consultations', updatedConsultation);
    this.clearCache('consultations');
  }

  // === إدارة الرسائل ===

  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    this.validateData('message', messageData);
    
    const message: Message = {
      id: this.generateId(),
      senderId: messageData.senderId!,
      senderName: messageData.senderName!,
      receiverId: messageData.receiverId!,
      receiverName: messageData.receiverName!,
      content: messageData.content!,
      attachments: messageData.attachments || [],
      isRead: false,
      createdAt: new Date().toISOString(),
      ...messageData
    };

    await this.db.add('messages', message);
    await this.updateConversation(message.senderId, message.receiverId, message.content);
    
    return message;
  }

  async getMessagesByConversation(userId1: string, userId2: string): Promise<Message[]> {
    const allMessages = await this.db.getAll<Message>('messages');
    
    return allMessages.filter(message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const message = await this.db.get<Message>('messages', messageId);
    if (!message) throw new Error('الرسالة غير موجودة');

    const updatedMessage = {
      ...message,
      isRead: true,
      readAt: new Date().toISOString()
    };

    await this.db.update('messages', updatedMessage);
  }

  // === إدارة مكالمات الفيديو ===

  async createVideoCall(callData: Partial<VideoCall>): Promise<VideoCall> {
    this.validateData('videoCall', callData);
    
    const videoCall: VideoCall = {
      id: this.generateId(),
      consultationId: callData.consultationId!,
      doctorId: callData.doctorId!,
      patientId: callData.patientId!,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      ...callData
    };

    await this.db.add('videoCalls', videoCall);
    
    return videoCall;
  }

  async updateVideoCallStatus(callId: string, status: string): Promise<void> {
    const call = await this.db.get<VideoCall>('videoCalls', callId);
    if (!call) throw new Error('المكالمة غير موجودة');

    const updates: Partial<VideoCall> = { status: status as any };

    if (status === 'started') {
      updates.startedAt = new Date().toISOString();
    } else if (status === 'ended') {
      updates.endedAt = new Date().toISOString();
      if (call.startedAt) {
        const duration = new Date().getTime() - new Date(call.startedAt).getTime();
        updates.duration = Math.floor(duration / 1000); // بالثواني
      }
    }

    const updatedCall = { ...call, ...updates };
    await this.db.update('videoCalls', updatedCall);
  }

  // === إدارة التقييمات ===

  async createRating(ratingData: Partial<Rating>): Promise<Rating> {
    this.validateData('rating', ratingData);
    
    const rating: Rating = {
      id: this.generateId(),
      consultationId: ratingData.consultationId!,
      doctorId: ratingData.doctorId!,
      patientId: ratingData.patientId!,
      rating: ratingData.rating!,
      createdAt: new Date().toISOString(),
      ...ratingData
    };

    await this.db.add('ratings', rating);
    await this.updateDoctorRating(rating.doctorId, rating.rating);
    
    return rating;
  }

  // === البحث المتقدم ===

  async searchConsultations(query: string, filters?: any): Promise<ConsultationRequest[]> {
    const consultations = await this.db.getAll<ConsultationRequest>('consultations');
    
    return consultations.filter(consultation => {
      const matchesQuery = !query || 
        consultation.title.toLowerCase().includes(query.toLowerCase()) ||
        consultation.description.toLowerCase().includes(query.toLowerCase()) ||
        consultation.specialty.toLowerCase().includes(query.toLowerCase());

      const matchesFilters = !filters || Object.entries(filters).every(([key, value]) => {
        return !value || (consultation as any)[key] === value;
      });

      return matchesQuery && matchesFilters;
    });
  }

  async searchDoctors(query: string, filters?: any): Promise<Doctor[]> {
    const doctors = await this.db.getAll<Doctor>('doctors');
    
    return doctors.filter(doctor => {
      const matchesQuery = !query || 
        doctor.fullName.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(query.toLowerCase()));

      const matchesFilters = !filters || Object.entries(filters).every(([key, value]) => {
        return !value || (doctor as any)[key] === value;
      });

      return matchesQuery && matchesFilters;
    });
  }

  // === إحصائيات ===

  async getStatistics(): Promise<any> {
    const [users, doctors, consultations, messages] = await Promise.all([
      this.db.count('users'),
      this.db.count('doctors'),
      this.db.count('consultations'),
      this.db.count('messages')
    ]);

    const pendingConsultations = await this.getConsultationsByStatus('pending');
    const completedConsultations = await this.getConsultationsByStatus('completed');

    return {
      totalUsers: users,
      totalDoctors: doctors,
      totalConsultations: consultations,
      totalMessages: messages,
      pendingConsultations: pendingConsultations.length,
      completedConsultations: completedConsultations.length,
      completionRate: consultations > 0 ? (completedConsultations.length / consultations) * 100 : 0
    };
  }

  // === طرق مساعدة ===

  private validateData(type: string, data: any): void {
    const schema = (dataSchemas as any)[type];
    if (!schema) return;

    // التحقق من الحقول المطلوبة
    for (const field of schema.required) {
      if (!(field in data) || data[field] === undefined || data[field] === null) {
        throw new Error(`الحقل ${field} مطلوب`);
      }
    }

    // التحقق من صحة البريد الإلكتروني
    if (data.email && !validationRules.email.test(data.email)) {
      throw new Error('البريد الإلكتروني غير صحيح');
    }

    // التحقق من التقييم
    if (data.rating && !validationRules.rating(data.rating)) {
      throw new Error('التقييم يجب أن يكون بين 1 و 5');
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private clearCache(prefix?: string): void {
    if (prefix) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private async updateConversation(userId1: string, userId2: string, lastMessage: string): Promise<void> {
    // تحديث أو إنشاء محادثة
    const conversationId = [userId1, userId2].sort().join('_');
    
    const conversation = {
      id: conversationId,
      participants: [userId1, userId2],
      lastMessage,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    await this.db.update('conversations', conversation);
  }

  private async seedInitialData(): Promise<void> {
    // إضافة بيانات أولية إذا لم تكن موجودة
    const userCount = await this.db.count('users');
    if (userCount === 0) {
      console.log('🌱 إضافة البيانات الأولية...');
      // يمكن إضافة بيانات تجريبية هنا
    }
  }

  // إغلاق قاعدة البيانات
  close(): void {
    this.db.close();
    this.cache.clear();
    this.isInitialized = false;
  }
}
