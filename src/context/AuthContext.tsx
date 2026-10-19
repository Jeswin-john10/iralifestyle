'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  joinedAt?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  isProfileDrawerOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  loginWithGoogle: (customDetails?: Partial<CustomerUser>) => Promise<CustomerUser>;
  loginWithEmail: (email: string, name?: string, phone?: string) => Promise<CustomerUser>;
  updateProfile: (data: Partial<CustomerUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ira_customer_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse customer session', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSession = (newUser: CustomerUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('ira_customer_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('ira_customer_user');
    }
  };

  const loginWithGoogle = async (customDetails?: Partial<CustomerUser>): Promise<CustomerUser> => {
    // Simulated Google OAuth authorization with authentic Google user profile
    const googleUser: CustomerUser = {
      id: `google-${Date.now()}`,
      name: customDetails?.name || 'Ananya Sharma',
      email: customDetails?.email || 'ananya.sharma@gmail.com',
      avatar: customDetails?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'google',
      phone: customDetails?.phone || '+91 98765 43210',
      address: customDetails?.address || 'Flat 402, Royal Palms, Bandra West',
      city: customDetails?.city || 'Mumbai',
      state: customDetails?.state || 'Maharashtra',
      pincode: customDetails?.pincode || '400050',
      joinedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    };

    saveUserSession(googleUser);
    setIsAuthModalOpen(false);
    return googleUser;
  };

  const loginWithEmail = async (email: string, name?: string, phone?: string): Promise<CustomerUser> => {
    const formattedName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const emailUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      name: formattedName,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=a67c43&textColor=ffffff`,
      provider: 'email',
      phone: phone || '',
      address: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      joinedAt: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    };

    saveUserSession(emailUser);
    setIsAuthModalOpen(false);
    return emailUser;
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);
  };

  const logout = () => {
    saveUserSession(null);
    setIsProfileDrawerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        isProfileDrawerOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openProfileDrawer: () => setIsProfileDrawerOpen(true),
        closeProfileDrawer: () => setIsProfileDrawerOpen(false),
        loginWithGoogle,
        loginWithEmail,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
