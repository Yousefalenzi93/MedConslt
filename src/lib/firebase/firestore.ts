import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  writeBatch,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import {
  ConsultationRequest,
  ConsultationResponse,
  Message,
  Conversation,
  SupportTicket,
  TicketMessage,
  LibraryDocument,
  ConsultationRating,
  DocumentRating,
  VideoCall,
  Notification
} from '@/types';

export class FirestoreService {
  // Consultation Management
  static async createConsultation(consultationData: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'consultations'), {
        ...consultationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create consultation');
    }
  }

  static async updateConsultation(consultationId: string, updates: Partial<ConsultationRequest>) {
    try {
      await updateDoc(doc(db, 'consultations', consultationId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update consultation');
    }
  }

  static async getConsultation(consultationId: string): Promise<ConsultationRequest | null> {
    try {
      const docSnap = await getDoc(doc(db, 'consultations', consultationId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ConsultationRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting consultation:', error);
      return null;
    }
  }

  static async getConsultationsByDoctor(doctorId: string, status?: string) {
    try {
      let q = query(
        collection(db, 'consultations'),
        where('assignedDoctorId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(
          collection(db, 'consultations'),
          where('assignedDoctorId', '==', doctorId),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConsultationRequest[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get consultations');
    }
  }

  static async getPendingConsultations(specialty?: string) {
    try {
      let q = query(
        collection(db, 'consultations'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );

      if (specialty) {
        q = query(
          collection(db, 'consultations'),
          where('status', '==', 'pending'),
          where('specialty', '==', specialty),
          orderBy('createdAt', 'asc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConsultationRequest[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get pending consultations');
    }
  }

  // Consultation Responses
  static async addConsultationResponse(responseData: Omit<ConsultationResponse, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'consultationResponses'), {
        ...responseData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add response');
    }
  }

  static async getConsultationResponses(consultationId: string) {
    try {
      const q = query(
        collection(db, 'consultationResponses'),
        where('consultationId', '==', consultationId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConsultationResponse[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get responses');
    }
  }

  // Messaging System
  static async sendMessage(messageData: Omit<Message, 'id' | 'createdAt'>) {
    try {
      const batch = writeBatch(db);
      
      // Add message
      const messageRef = doc(collection(db, 'messages'));
      batch.set(messageRef, {
        ...messageData,
        createdAt: serverTimestamp()
      });

      // Update or create conversation
      const conversationId = [messageData.senderId, messageData.receiverId].sort().join('_');
      const conversationRef = doc(db, 'conversations', conversationId);
      
      batch.set(conversationRef, {
        id: conversationId,
        participants: [messageData.senderId, messageData.receiverId],
        participantNames: [messageData.senderName, messageData.receiverName],
        lastMessage: messageData.content,
        lastMessageAt: serverTimestamp(),
        unreadCount: {
          [messageData.senderId]: 0,
          [messageData.receiverId]: increment(1)
        },
        updatedAt: serverTimestamp()
      }, { merge: true });

      await batch.commit();
      return messageRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send message');
    }
  }

  static async getConversations(userId: string) {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get conversations');
    }
  }

  static async getMessages(conversationId: string, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('senderId', 'in', conversationId.split('_')),
        where('receiverId', 'in', conversationId.split('_')),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get messages');
    }
  }

  static async markMessageAsRead(messageId: string) {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        isRead: true,
        readAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark message as read');
    }
  }

  // Support Tickets
  static async createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'supportTickets'), {
        ...ticketData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create support ticket');
    }
  }

  static async updateSupportTicket(ticketId: string, updates: Partial<SupportTicket>) {
    try {
      await updateDoc(doc(db, 'supportTickets', ticketId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update support ticket');
    }
  }

  static async getSupportTickets(userId?: string, status?: string) {
    try {
      let q = query(
        collection(db, 'supportTickets'),
        orderBy('createdAt', 'desc')
      );

      if (userId) {
        q = query(
          collection(db, 'supportTickets'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      }

      if (status) {
        q = query(
          collection(db, 'supportTickets'),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupportTicket[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get support tickets');
    }
  }

  // Medical Library
  static async addLibraryDocument(documentData: Omit<LibraryDocument, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'libraryDocuments'), {
        ...documentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add library document');
    }
  }

  static async getLibraryDocuments(specialty?: string, documentType?: string) {
    try {
      let q = query(
        collection(db, 'libraryDocuments'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      if (specialty) {
        q = query(
          collection(db, 'libraryDocuments'),
          where('isPublic', '==', true),
          where('specialty', '==', specialty),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LibraryDocument[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get library documents');
    }
  }

  // Ratings
  static async addConsultationRating(ratingData: Omit<ConsultationRating, 'id' | 'createdAt'>) {
    try {
      const batch = writeBatch(db);
      
      // Add rating
      const ratingRef = doc(collection(db, 'consultationRatings'));
      batch.set(ratingRef, {
        ...ratingData,
        createdAt: serverTimestamp()
      });

      // Update doctor's average rating
      const doctorRef = doc(db, 'users', ratingData.doctorId);
      batch.update(doctorRef, {
        totalRatings: increment(1),
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return ratingRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add rating');
    }
  }

  // Video Call Management
  static async createVideoCall(callData: Omit<VideoCall, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'videoCalls'), {
        ...callData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create video call');
    }
  }

  static async updateVideoCall(callId: string, updates: Partial<VideoCall>) {
    try {
      await updateDoc(doc(db, 'videoCalls', callId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update video call');
    }
  }

  static async getVideoCallsByDoctor(doctorId: string) {
    try {
      const q = query(
        collection(db, 'videoCalls'),
        where('doctorId', '==', doctorId),
        orderBy('scheduledAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoCall[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get video calls');
    }
  }

  // Notification Management
  static async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create notification');
    }
  }

  static async getNotifications(userId: string, isRead?: boolean) {
    try {
      let q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      if (typeof isRead === 'boolean') {
        q = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          where('isRead', '==', isRead),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get notifications');
    }
  }

  static async markNotificationAsRead(notificationId: string) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        readAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  }

  // Analytics and Dashboard Data
  static async getDashboardMetrics() {
    try {
      // This would typically involve multiple queries and aggregations
      // For now, returning mock data structure
      const metrics = {
        activeDoctors: 0,
        totalConsultations: 0,
        videoCallsCompleted: 0,
        averageResponseTime: 0,
        topSpecialties: [],
        monthlyTrends: [],
        weeklyTrends: []
      };

      // In a real implementation, you would:
      // 1. Query users collection for active doctors count
      // 2. Query consultations for total count and response times
      // 3. Query videoCalls for completed calls
      // 4. Aggregate data for trends and specialties

      return metrics;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get dashboard metrics');
    }
  }

  // Real-time listeners
  static subscribeToConsultations(doctorId: string, callback: (consultations: ConsultationRequest[]) => void) {
    const q = query(
      collection(db, 'consultations'),
      where('assignedDoctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const consultations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConsultationRequest[];
      callback(consultations);
    });
  }

  static subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const participants = conversationId.split('_');
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', participants),
      where('receiverId', 'in', participants),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    });
  }

  static subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      callback(notifications);
    });
  }
}
