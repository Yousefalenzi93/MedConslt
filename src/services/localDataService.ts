// Local Data Service - إدارة البيانات المحلية
import usersData from '@/data/users.json';
import consultationsData from '@/data/consultations.json';
import messagesData from '@/data/messages.json';
import libraryData from '@/data/medical-library.json';
import ratingsData from '@/data/ratings.json';
import supportData from '@/data/support.json';

// Types
export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'doctor' | 'admin' | 'patient';
  specialty?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  rating?: number;
  experience?: number;
  education?: string;
  certifications?: string[];
  workingHours?: Record<string, string>;
  consultationFee?: number;
  totalConsultations?: number;
  completedConsultations?: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  bloodType?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  permissions?: string[];
  createdAt: string;
  lastActive: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  symptoms: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'video' | 'chat' | 'phone';
  scheduledDate: string;
  duration: number;
  fee: number;
  notes: string;
  diagnosis: string;
  prescription: Array<{
    medication: string;
    dosage: string;
    duration: string;
    instructions: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  consultationId: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'medical_platform_users',
  CONSULTATIONS: 'medical_platform_consultations',
  MESSAGES: 'medical_platform_messages',
  CONVERSATIONS: 'medical_platform_conversations',
  LIBRARY: 'medical_platform_library',
  RATINGS: 'medical_platform_ratings',
  SUPPORT: 'medical_platform_support',
  CURRENT_USER: 'medical_platform_current_user'
};

class LocalDataService {
  // Initialize data in localStorage if not exists
  initializeData() {
    if (typeof window === 'undefined') return;

    // Initialize users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData.users));
    }

    // Initialize consultations
    if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultationsData.consultations));
    }

    // Initialize messages and conversations
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesData.messages));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(messagesData.conversations));
    }

    // Initialize library
    if (!localStorage.getItem(STORAGE_KEYS.LIBRARY)) {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libraryData.documents));
    }

    // Initialize ratings
    if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratingsData.ratings));
    }

    // Initialize support
    if (!localStorage.getItem(STORAGE_KEYS.SUPPORT)) {
      localStorage.setItem(STORAGE_KEYS.SUPPORT, JSON.stringify(supportData.tickets));
    }
  }

  // Generic CRUD operations
  private getData<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setData<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User operations
  getUsers(): User[] {
    return this.getData<User>(STORAGE_KEYS.USERS);
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastActive'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    users.push(newUser);
    this.setData(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...updates, lastActive: new Date().toISOString() };
    this.setData(STORAGE_KEYS.USERS, users);
    return users[index];
  }

  // Authentication
  authenticate(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) {
      // Update last active
      this.updateUser(user.id, { lastActive: new Date().toISOString() });
      // Store current user (without password)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      return userWithoutPassword as User;
    }
    return null;
  }

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Consultation operations
  getConsultations(): Consultation[] {
    return this.getData<Consultation>(STORAGE_KEYS.CONSULTATIONS);
  }

  getConsultationById(id: string): Consultation | null {
    const consultations = this.getConsultations();
    return consultations.find(consultation => consultation.id === id) || null;
  }

  getConsultationsByUser(userId: string, role: 'doctor' | 'patient'): Consultation[] {
    const consultations = this.getConsultations();
    return consultations.filter(consultation => 
      role === 'doctor' ? consultation.doctorId === userId : consultation.patientId === userId
    );
  }

  createConsultation(consultationData: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>): Consultation {
    const consultations = this.getConsultations();
    const newConsultation: Consultation = {
      ...consultationData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    consultations.push(newConsultation);
    this.setData(STORAGE_KEYS.CONSULTATIONS, consultations);
    return newConsultation;
  }

  updateConsultation(id: string, updates: Partial<Consultation>): Consultation | null {
    const consultations = this.getConsultations();
    const index = consultations.findIndex(consultation => consultation.id === id);
    if (index === -1) return null;

    consultations[index] = { 
      ...consultations[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.setData(STORAGE_KEYS.CONSULTATIONS, consultations);
    return consultations[index];
  }

  deleteConsultation(id: string): boolean {
    const consultations = this.getConsultations();
    const filteredConsultations = consultations.filter(consultation => consultation.id !== id);
    if (filteredConsultations.length === consultations.length) return false;
    
    this.setData(STORAGE_KEYS.CONSULTATIONS, filteredConsultations);
    return true;
  }

  // Message operations
  getConversations(): Conversation[] {
    return this.getData<Conversation>(STORAGE_KEYS.CONVERSATIONS);
  }

  getMessages(): Message[] {
    return this.getData<Message>(STORAGE_KEYS.MESSAGES);
  }

  getMessagesByConversation(conversationId: string): Message[] {
    const messages = this.getMessages();
    return messages.filter(message => message.conversationId === conversationId);
  }

  getUserConversations(userId: string): Conversation[] {
    const conversations = this.getConversations();
    return conversations.filter(conversation => 
      conversation.participants.includes(userId)
    );
  }

  createMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Message {
    const messages = this.getMessages();
    const newMessage: Message = {
      ...messageData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    this.setData(STORAGE_KEYS.MESSAGES, messages);

    // Update conversation
    this.updateConversationLastMessage(messageData.conversationId, newMessage);

    return newMessage;
  }

  private updateConversationLastMessage(conversationId: string, message: Message): void {
    const conversations = this.getConversations();
    const index = conversations.findIndex(conv => conv.id === conversationId);
    if (index !== -1) {
      conversations[index].lastMessage = message.content;
      conversations[index].lastMessageTime = message.createdAt;
      conversations[index].updatedAt = message.createdAt;
      
      // Update unread count
      conversations[index].unreadCount[message.receiverId] = 
        (conversations[index].unreadCount[message.receiverId] || 0) + 1;
      
      this.setData(STORAGE_KEYS.CONVERSATIONS, conversations);
    }
  }

  markMessagesAsRead(conversationId: string, userId: string): void {
    const messages = this.getMessages();
    const updatedMessages = messages.map(message => {
      if (message.conversationId === conversationId && message.receiverId === userId) {
        return { ...message, isRead: true };
      }
      return message;
    });
    this.setData(STORAGE_KEYS.MESSAGES, updatedMessages);

    // Reset unread count
    const conversations = this.getConversations();
    const index = conversations.findIndex(conv => conv.id === conversationId);
    if (index !== -1) {
      conversations[index].unreadCount[userId] = 0;
      this.setData(STORAGE_KEYS.CONVERSATIONS, conversations);
    }
  }

  // Library operations
  getLibraryDocuments(): any[] {
    return this.getData<any>(STORAGE_KEYS.LIBRARY);
  }

  getLibraryDocumentById(id: string): any | null {
    const documents = this.getLibraryDocuments();
    return documents.find(doc => doc.id === id) || null;
  }

  createLibraryDocument(documentData: any): any {
    const documents = this.getLibraryDocuments();
    const newDocument = {
      ...documentData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    documents.push(newDocument);
    this.setData(STORAGE_KEYS.LIBRARY, documents);
    return newDocument;
  }

  updateLibraryDocument(id: string, updates: any): any | null {
    const documents = this.getLibraryDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;

    documents[index] = {
      ...documents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.setData(STORAGE_KEYS.LIBRARY, documents);
    return documents[index];
  }

  deleteLibraryDocument(id: string): boolean {
    const documents = this.getLibraryDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== id);
    if (filteredDocuments.length === documents.length) return false;

    this.setData(STORAGE_KEYS.LIBRARY, filteredDocuments);
    return true;
  }

  // Ratings operations
  getRatings(): any[] {
    return this.getData<any>(STORAGE_KEYS.RATINGS);
  }

  getRatingById(id: string): any | null {
    const ratings = this.getRatings();
    return ratings.find(rating => rating.id === id) || null;
  }

  getRatingsByDoctor(doctorId: string): any[] {
    const ratings = this.getRatings();
    return ratings.filter(rating => rating.doctorId === doctorId);
  }

  getRatingsByPatient(patientId: string): any[] {
    const ratings = this.getRatings();
    return ratings.filter(rating => rating.patientId === patientId);
  }

  createRating(ratingData: any): any {
    const ratings = this.getRatings();
    const newRating = {
      ...ratingData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ratings.push(newRating);
    this.setData(STORAGE_KEYS.RATINGS, ratings);
    return newRating;
  }

  updateRating(id: string, updates: any): any | null {
    const ratings = this.getRatings();
    const index = ratings.findIndex(rating => rating.id === id);
    if (index === -1) return null;

    ratings[index] = {
      ...ratings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.setData(STORAGE_KEYS.RATINGS, ratings);
    return ratings[index];
  }

  deleteRating(id: string): boolean {
    const ratings = this.getRatings();
    const filteredRatings = ratings.filter(rating => rating.id !== id);
    if (filteredRatings.length === ratings.length) return false;

    this.setData(STORAGE_KEYS.RATINGS, filteredRatings);
    return true;
  }

  // Support operations
  getSupportTickets(): any[] {
    return this.getData<any>(STORAGE_KEYS.SUPPORT);
  }

  getSupportTicketById(id: string): any | null {
    const tickets = this.getSupportTickets();
    return tickets.find(ticket => ticket.id === id) || null;
  }

  getSupportTicketsByUser(userId: string): any[] {
    const tickets = this.getSupportTickets();
    return tickets.filter(ticket => ticket.userId === userId);
  }

  createSupportTicket(ticketData: any): any {
    const tickets = this.getSupportTickets();
    const newTicket = {
      ...ticketData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tickets.push(newTicket);
    this.setData(STORAGE_KEYS.SUPPORT, tickets);
    return newTicket;
  }

  updateSupportTicket(id: string, updates: any): any | null {
    const tickets = this.getSupportTickets();
    const index = tickets.findIndex(ticket => ticket.id === id);
    if (index === -1) return null;

    tickets[index] = {
      ...tickets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.setData(STORAGE_KEYS.SUPPORT, tickets);
    return tickets[index];
  }

  deleteSupportTicket(id: string): boolean {
    const tickets = this.getSupportTickets();
    const filteredTickets = tickets.filter(ticket => ticket.id !== id);
    if (filteredTickets.length === tickets.length) return false;

    this.setData(STORAGE_KEYS.SUPPORT, filteredTickets);
    return true;
  }
}

// Export singleton instance
export const localDataService = new LocalDataService();

// Initialize data on import
if (typeof window !== 'undefined') {
  localDataService.initializeData();
}
