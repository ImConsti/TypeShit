'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  role: 'user' | 'admin' | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedEmail = localStorage.getItem('user_email');
    const storedRole = localStorage.getItem('user_role') as 'user' | 'admin' | null;
    
    if (token) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
      setRole(storedRole);
    }
  }, []);

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

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_email', data.email);
    // Rolle hier aus Token oder Response extrahieren
    localStorage.setItem('user_role', data.role || 'user');

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

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_email', data.email);
    localStorage.setItem('user_role', 'user');

    setIsAuthenticated(true);
    setEmail(data.email);
    setRole('user');
    router.push('/statistics');
  };

  const resetPassword = async (emailInput: string) => {
    const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput }),
    });

    if (!response.ok) {
      throw new Error('Passwort-Reset fehlgeschlagen');
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    
    setIsAuthenticated(false);
    setEmail(null);
    setRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, role, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden");
  return context;
};