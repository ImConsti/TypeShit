'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/app/contexts/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage('Bitte E-Mail und Passwort eingeben.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Willkommen zurück!</h2>
      <form onSubmit={onLogin}>
        
        <div className={styles.formGroup}>
          <label htmlFor="email">E-Mail</label>
          <input 
            type="email" 
            id="email" 
            className={styles.formControl} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
          <label htmlFor="password">Passwort</label>
          <input 
            type="password" 
            id="password" 
            className={styles.formControl} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        {errorMessage && (
          <div className={styles.errorMessage} style={{ marginTop: '1rem', color: 'red' }}>
            {errorMessage}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!email || !password || isLoading} 
          className={styles.btnPrimary} 
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {isLoading ? 'Logge ein...' : 'Login'}
        </button>
        
      </form>
      <hr />
      <div className={styles.links}>
        <Link href="/register">Noch keinen Account? Registrieren</Link>
        <br />
        <Link href="/forgot-password">Passwort vergessen?</Link>
      </div>
    </div>
  );
}