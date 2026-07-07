'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // TODO: ersetzen durch GET /api/auth/me (Authorization-Header)
    const token = localStorage.getItem('auth_token');
    const storedEmail = localStorage.getItem('user_email');
    if (token) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
    }
  }, []);

  const login = async (emailInput: string, passwordInput: string) => {
    // TODO: ersetzen durch POST /api/auth/login
    await new Promise(resolve => setTimeout(resolve, 800));

    if (emailInput && passwordInput.length >= 6) {
      const mockToken = 'mock-jwt-token-12345';

      // TODO: das token aus der /api/auth/login-Antwort
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', emailInput);

      document.cookie = `auth_token=${mockToken}; path=/`;

      setIsAuthenticated(true);
      setEmail(emailInput);

      router.push('/statistics');
    } else {
      throw new Error('E-Mail oder Passwort ist ungültig.');
    }
  };

  const register = async (emailInput: string, passwordInput: string) => {
    // TODO: ersetzen durch POST /api/auth/register
    await new Promise(resolve => setTimeout(resolve, 800));

    if (emailInput && passwordInput.length >= 6) {
      const mockToken = 'mock-jwt-token-reg-12345';

      // TODO: den Token vom Backend speichern
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', emailInput);

      document.cookie = `auth_token=${mockToken}; path=/`;

      setIsAuthenticated(true);
      setEmail(emailInput);

      router.push('/statistics');
    } else {
      throw new Error('E-Mail ungültig oder Passwort zu kurz (min. 6 Zeichen).');
    }
  };

  const resetPassword = async (emailInput: string) => {
    // TODO: ersetzen durch POST /api/auth/reset-password
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!emailInput.includes('@')) {
      throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
    }
  };

  const logout = () => {
    // TODO: zusätzlich POST /api/auth/logout (Authorization-Header)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    setIsAuthenticated(false);
    setEmail(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};