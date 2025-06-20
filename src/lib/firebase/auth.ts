import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './config';
import { Doctor, Admin, User } from '@/types';

export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userData = await this.getUserData(user.uid);
      
      if (!userData) {
        throw new Error('User data not found');
      }
      
      if (!userData.isActive) {
        throw new Error('Account is deactivated. Please contact support.');
      }
      
      // Update last active timestamp
      await this.updateLastActive(user.uid);
      
      return { user, userData };
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    }
  }

  // Register new doctor
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
  }) {
    try {
      // Check if license number already exists
      const licenseExists = await this.checkLicenseExists(doctorData.medicalLicenseNumber);
      if (licenseExists) {
        throw new Error('Medical license number already registered');
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        doctorData.email,
        doctorData.password
      );
      const user = userCredential.user;

      // Update Firebase profile
      await updateProfile(user, {
        displayName: doctorData.fullName
      });

      // Create doctor document in Firestore
      const doctorDoc: Omit<Doctor, 'id'> = {
        email: doctorData.email,
        role: 'doctor',
        isActive: false, // Requires admin activation
        fullName: doctorData.fullName,
        medicalLicenseNumber: doctorData.medicalLicenseNumber,
        specialty: doctorData.specialty,
        city: doctorData.city,
        workplace: doctorData.workplace,
        yearsOfExperience: doctorData.yearsOfExperience,
        bio: doctorData.bio || '',
        isLicenseVerified: false,
        averageRating: 0,
        totalRatings: 0,
        totalConsultations: 0,
        isAvailable: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActiveAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid), doctorDoc);

      // Send email verification
      await sendEmailVerification(user);

      return { user, userData: { ...doctorDoc, id: user.uid } };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  }

  // Get current user data
  static async getCurrentUser(): Promise<{ user: FirebaseUser; userData: Doctor | Admin } | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          try {
            const userData = await this.getUserData(user.uid);
            if (userData) {
              resolve({ user, userData });
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  // Get user data from Firestore
  static async getUserData(uid: string): Promise<Doctor | Admin | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { id: uid, ...userDoc.data() } as Doctor | Admin;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Update user profile
  static async updateProfile(uid: string, updates: Partial<Doctor | Admin>) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  // Update last active timestamp
  static async updateLastActive(uid: string) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastActiveAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }

  // Check if medical license number exists
  static async checkLicenseExists(licenseNumber: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'users'),
        where('medicalLicenseNumber', '==', licenseNumber)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking license:', error);
      return false;
    }
  }

  // Send password reset email
  static async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  // Admin functions
  static async activateDoctor(doctorId: string) {
    try {
      await updateDoc(doc(db, 'users', doctorId), {
        isActive: true,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Doctor activation failed');
    }
  }

  static async deactivateDoctor(doctorId: string) {
    try {
      await updateDoc(doc(db, 'users', doctorId), {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Doctor deactivation failed');
    }
  }

  static async verifyLicense(doctorId: string) {
    try {
      await updateDoc(doc(db, 'users', doctorId), {
        isLicenseVerified: true,
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw new Error(error.message || 'License verification failed');
    }
  }
}
