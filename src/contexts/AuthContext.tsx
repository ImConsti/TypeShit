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
    const token = localStorage.getItem('auth_token');
    const storedEmail = localStorage.getItem('user_email');
    if (token) {
      setIsAuthenticated(true);
      setEmail(storedEmail);
    }
  }, []);

  const login = async (emailInput: string, passwordInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (emailInput && passwordInput.length >= 6) {
      const mockToken = 'mock-jwt-token-12345';
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', emailInput);
      
      document.cookie = `auth_token=${mockToken}; path=/`;
      
      setIsAuthenticated(true);
      setEmail(emailInput);
      
      router.push('/');
    } else {
      throw new Error('E-Mail oder Passwort ist ungültig.');
    }
  };

  const register = async (emailInput: string, passwordInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (emailInput && passwordInput.length >= 6) {
      const mockToken = 'mock-jwt-token-reg-12345';
      
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_email', emailInput);
      
      document.cookie = `auth_token=${mockToken}; path=/`;
      
      setIsAuthenticated(true);
      setEmail(emailInput);
      
      router.push('/');
    } else {
      throw new Error('E-Mail ungültig oder Passwort zu kurz (min. 6 Zeichen).');
    }
  };

  const resetPassword = async (emailInput: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!emailInput.includes('@')) {
      throw new Error('Bitte eine gültige E-Mail-Adresse eingeben.');
    }
  };

  const logout = () => {
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
  if (!context) throw new Error("useAuth muss innerhalb eines AuthProviders verwendet werden");
  return context;
};