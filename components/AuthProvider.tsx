"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name?: string; email: string } | null;

type MfaResult = { mfa_required: true; mfa_token: string };
type AuthContextType = {
  user: User;
  login: (email: string, password: string, totp?: string) => Promise<boolean | MfaResult>;
  completeTotp: (mfa_token: string, code: string) => Promise<boolean>;
  startEmailOtp: (mfa_token: string) => Promise<boolean>;
  completeEmailOtp: (mfa_token: string, code: string) => Promise<boolean>;
  completeRecovery: (mfa_token: string, code: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "ftx_token";
const USER_KEY = "ftx_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from server (cookie-based)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            // Also sync with localStorage for consistency
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return;
          }
        }
        
        // If server auth fails, try localStorage fallback
        const userData = localStorage.getItem(USER_KEY);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        
        // Fallback to localStorage
        try {
          const userData = localStorage.getItem(USER_KEY);
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (e) {
          console.error('LocalStorage fallback error:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function login(email: string, password: string, totp?: string): Promise<boolean | MfaResult> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, totp }),
      });

      const data = await response.json();

      if (data.mfa_required && data.mfa_token) {
        return { mfa_required: true, mfa_token: data.mfa_token };
      }

      if (!response.ok || !data.success) {
        return false;
      }
      
      if (data.success && data.token && data.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async function completeTotp(mfa_token: string, code: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfa_token, code }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) return false;
      if (data.user) {
        // Token cookie is set server-side; we only update local user state
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
        return true;
      }
      return false;
    } catch (e) {
      console.error('MFA completion error:', e);
      return false;
    }
  }

  async function signup(name: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success) {
        // Note: User needs to verify email, so don't automatically log them in
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  }

  function logout(): void {
    // Call logout API to clear server-side cookie
    fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(error => {
      console.error('Logout API error:', error);
    });

    // Clear client-side state
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function startEmailOtp(mfa_token: string): Promise<boolean> {
    try {
      const r = await fetch('/api/auth/login/email-otp/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mfa_token }) });
      const d = await r.json();
      return r.ok && d.success === true;
    } catch (e) {
      console.error('startEmailOtp error', e); return false;
    }
  }

  async function completeEmailOtp(mfa_token: string, code: string): Promise<boolean> {
    try {
      const r = await fetch('/api/auth/login/email-otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mfa_token, code }) });
      const d = await r.json();
      if (!r.ok || !d.success) return false;
      if (d.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(d.user));
        setUser(d.user);
        return true;
      }
      return false;
    } catch (e) { console.error('completeEmailOtp error', e); return false; }
  }

  async function completeRecovery(mfa_token: string, code: string): Promise<boolean> {
    try {
      const r = await fetch('/api/auth/login/recovery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mfa_token, code }) });
      const d = await r.json();
      if (!r.ok || !d.success) return false;
      if (d.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(d.user));
        setUser(d.user);
        return true;
      }
      return false;
    } catch (e) { console.error('completeRecovery error', e); return false; }
  }

  return (
    <AuthContext.Provider value={{ user, login, completeTotp, startEmailOtp, completeEmailOtp, completeRecovery, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
