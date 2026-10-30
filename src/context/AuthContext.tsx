'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CustomerUser } from '@/types';

export type { CustomerUser };

interface AuthContextType {
  user: CustomerUser | null;
  loading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  isProfileDrawerOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  loginWithGoogle: (returnUrl?: string) => void;
  loginWithGoogleCredential: (credential: string) => Promise<CustomerUser>;
  updateProfile: (data: Partial<CustomerUser>) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const saveUserSession = useCallback((newUser: CustomerUser | null) => {
    setUser(newUser);
    if (newUser) {
      try {
        localStorage.setItem('ira_customer_user', JSON.stringify(newUser));
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }
    } else {
      try {
        localStorage.removeItem('ira_customer_user');
      } catch (e) {
        console.warn('Could not remove from localStorage', e);
      }
    }
  }, []);

  // Real-time server session synchronization
  const syncServerSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          saveUserSession(data.user);
          return data.user;
        }
      }
      saveUserSession(null);
    } catch (err) {
      console.warn('Real-time session sync error:', err);
      saveUserSession(null);
    }
    return null;
  }, [saveUserSession]);

  useEffect(() => {
    // 1. Process Google OAuth callback from URL redirect
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authSuccess = params.get('auth_success');
      const err = params.get('auth_error');

      if (authSuccess) {
        syncServerSession().finally(() => {
          setLoading(false);
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('auth_success');
          cleanUrl.searchParams.delete('auth_name');
          window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
        });
        return;
      }

      if (err) {
        setAuthError(decodeURIComponent(err));
        setLoading(false);
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('auth_error');
        window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
        return;
      }
    }

    // 2. Load real-time authenticated customer session from server
    syncServerSession().finally(() => {
      setLoading(false);
    });
  }, [syncServerSession]);

  const loginWithGoogle = (returnUrl?: string) => {
    const destination = returnUrl || (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
    const targetUrl = `/api/auth/google?redirect=${encodeURIComponent(destination)}`;
    if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }
  };

  const loginWithGoogleCredential = async (credential: string): Promise<CustomerUser> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate with Google');
      }

      saveUserSession(data.user);
      setIsAuthModalOpen(false);
      return data.user;
    } catch (err) {
      setAuthError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);

    try {
      await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Could not persist profile changes to server:', e);
    }
  };

  const logout = async () => {
    saveUserSession(null);
    setIsProfileDrawerOpen(false);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthModalOpen,
        isProfileDrawerOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openProfileDrawer: () => setIsProfileDrawerOpen(true),
        closeProfileDrawer: () => setIsProfileDrawerOpen(false),
        loginWithGoogle,
        loginWithGoogleCredential,
        updateProfile,
        logout,
        clearAuthError,
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
