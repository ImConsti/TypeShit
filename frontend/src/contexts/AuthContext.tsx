'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  role: 'user' | 'admin' | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (email: string, pass: string) => Promise<void>;
  requestReset: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const storedEmail = sessionStorage.getItem('user_email');
    const storedRole = sessionStorage.getItem('user_role') as 'user' | 'admin' | null;

    if (token) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
      setRole(storedRole);
    } else {
      const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!publicRoutes.includes(pathname)) {
        router.push('/login');
      }
    }
  }, [pathname, router]);

  const login = async (emailInput: string, passwordInput: string) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login fehlgeschlagen');
    }

    sessionStorage.setItem('auth_token', data.token);
    sessionStorage.setItem('user_email', data.email);
    sessionStorage.setItem('user_role', data.role || 'user');

    setIsAuthenticated(true);
    setEmail(data.email);
    setRole(data.role || 'user');
    router.push('/statistics');
  };

  const register = async (emailInput: string, passwordInput: string) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registrierung fehlgeschlagen');
    }

    sessionStorage.setItem('auth_token', data.token);
    sessionStorage.setItem('user_email', data.email);
    sessionStorage.setItem('user_role', 'user');

    setIsAuthenticated(true);
    setEmail(data.email);
    setRole('user');
    router.push('/statistics');
  };

  const requestReset = async (emailInput: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/api/auth/request-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Anfrage fehlgeschlagen');
    }

    return data.token;
  };

  const resetPassword = async (token: string, newPasswordInput: string) => {
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: newPasswordInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Passwort-Reset fehlgeschlagen');
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` }
    });

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_role');

    setIsAuthenticated(false);
    setEmail(null);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, role, login, logout, register, resetPassword, requestReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden");
  return context;
};