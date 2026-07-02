'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from '@/src/app/login/login.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordRepeat) {
      setErrorMessage('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (!email || password.length < 6) {
      setErrorMessage('Bitte gültige E-Mail und ein Passwort (min. 6 Zeichen) eingeben.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      await register(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Account erstellen</h2>
      <form onSubmit={onRegister}>
        
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

        <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
          <label htmlFor="passwordRepeat">Passwort wiederholen</label>
          <input 
            type="password" 
            id="passwordRepeat" 
            className={styles.formControl} 
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
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
          disabled={!email || !password || !passwordRepeat || isLoading} 
          className={styles.btnPrimary} 
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {isLoading ? 'Registriere...' : 'Registrieren'}
        </button>
        
      </form>
      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
      <div className={styles.links}>
        <Link href="/login">Bereits einen Account? Hier einloggen</Link>
      </div>
    </div>
  );
}