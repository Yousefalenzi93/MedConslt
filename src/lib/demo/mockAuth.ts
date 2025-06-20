// Mock authentication service for demo purposes
// This simulates Firebase Auth without requiring actual Firebase setup

export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
}

export interface MockUserData {
  id: string;
  email: string;
  fullName: string;
  role: 'doctor' | 'admin';
  specialty?: string;
  city?: string;
  workplace?: string;
  yearsOfExperience?: number;
  isActive: boolean;
  isLicenseVerified: boolean;
  averageRating: number;
  totalRatings: number;
  totalConsultations: number;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

// Mock users database
const mockUsers: { [key: string]: MockUserData } = {
  'doctor@example.com': {
    id: 'doctor-1',
    email: 'doctor@example.com',
    fullName: 'د. أحمد محمد',
    role: 'doctor',
    specialty: 'Cardiology',
    city: 'Riyadh',
    workplace: 'مستشفى الملك فيصل التخصصي',
    yearsOfExperience: 10,
    isActive: true,
    isLicenseVerified: true,
    averageRating: 4.8,
    totalRatings: 156,
    totalConsultations: 234,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    lastActiveAt: new Date()
  },
  'admin@example.com': {
    id: 'admin-1',
    email: 'admin@example.com',
    fullName: 'مدير النظام',
    role: 'admin',
    isActive: true,
    isLicenseVerified: true,
    averageRating: 0,
    totalRatings: 0,
    totalConsultations: 0,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
    lastActiveAt: new Date()
  }
};

// Mock authentication state
let currentUser: MockUser | null = null;
let authListeners: ((user: MockUser | null) => void)[] = [];

export class MockAuthService {
  static async signIn(email: string, password: string): Promise<{ user: MockUser; userData: MockUserData }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (password !== 'demo123' && password !== 'admin123') {
      throw new Error('كلمة المرور غير صحيحة');
    }

    const userData = mockUsers[email];
    if (!userData) {
      throw new Error('البريد الإلكتروني غير مسجل');
    }

    if (!userData.isActive) {
      throw new Error('الحساب غير مفعل. يرجى التواصل مع الإدارة.');
    }

    const user: MockUser = {
      uid: userData.id,
      email: userData.email,
      displayName: userData.fullName
    };

    currentUser = user;
    
    // Notify listeners
    authListeners.forEach(listener => listener(user));

    // Store in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserData', JSON.stringify(userData));

    return { user, userData };
  }

  static async signOut(): Promise<void> {
    currentUser = null;
    
    // Notify listeners
    authListeners.forEach(listener => listener(null));

    // Clear localStorage
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserData');
  }

  static async getCurrentUser(): Promise<{ user: MockUser; userData: MockUserData } | null> {
    // Check localStorage for persisted user
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('mockUser');
      const storedUserData = localStorage.getItem('mockUserData');
      
      if (storedUser && storedUserData) {
        const user = JSON.parse(storedUser);
        const userData = JSON.parse(storedUserData);
        currentUser = user;
        return { user, userData };
      }
    }

    return null;
  }

  static onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    authListeners.push(callback);
    
    // Immediately call with current user
    callback(currentUser);

    // Return unsubscribe function
    return () => {
      authListeners = authListeners.filter(listener => listener !== callback);
    };
  }

  static async registerDoctor(doctorData: {
    email: string;
    password: string;
    fullName: string;
    medicalLicenseNumber: string;
    specialty: string;
    city: string;
    workplace: string;
    yearsOfExperience: number;
    bio?: string;
  }): Promise<{ user: MockUser; userData: MockUserData }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists
    if (mockUsers[doctorData.email]) {
      throw new Error('البريد الإلكتروني مسجل مسبقاً');
    }

    // Create new user data
    const userData: MockUserData = {
      id: `doctor-${Date.now()}`,
      email: doctorData.email,
      fullName: doctorData.fullName,
      role: 'doctor',
      specialty: doctorData.specialty,
      city: doctorData.city,
      workplace: doctorData.workplace,
      yearsOfExperience: doctorData.yearsOfExperience,
      isActive: false, // Requires admin activation
      isLicenseVerified: false,
      averageRating: 0,
      totalRatings: 0,
      totalConsultations: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date()
    };

    // Add to mock database
    mockUsers[doctorData.email] = userData;

    const user: MockUser = {
      uid: userData.id,
      email: userData.email,
      displayName: userData.fullName
    };

    return { user, userData };
  }

  static async getUserData(uid: string): Promise<MockUserData | null> {
    const userData = Object.values(mockUsers).find(user => user.id === uid);
    return userData || null;
  }

  static async resetPassword(email: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!mockUsers[email]) {
      throw new Error('البريد الإلكتروني غير مسجل');
    }

    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`);
  }
}

// Export for use in components
export { currentUser, mockUsers };
