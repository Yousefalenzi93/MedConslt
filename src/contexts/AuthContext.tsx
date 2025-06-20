'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { localDataService, User } from '@/services/localDataService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const currentUser = localDataService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const authenticatedUser = localDataService.authenticate(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }

    setLoading(false);
    return false;
  };

  const signOut = () => {
    localDataService.logout();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = localDataService.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
    } catch (error) {
      console.error('Update user error:', error);
    }

    return false;
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
