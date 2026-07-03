'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from '@/src/app/login/login.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Bitte eine E-Mail-Adresse eingeben.');
      return;
    }

    setErrorMessage('');
    setMessage('');
    setIsLoading(true);

    try {
      await resetPassword(email);
      setMessage('Ein Link zum Zurücksetzen wurde an deine E-Mail gesendet.');
      setEmail('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Passwort vergessen</h2>
      <form onSubmit={onReset}>
        
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

        {errorMessage && (
          <div className={styles.errorMessage} style={{ marginTop: '1rem', color: 'red' }}>
            {errorMessage}
          </div>
        )}

        {message && (
          <div className={styles.errorMessage} style={{ marginTop: '1rem', color: 'green', backgroundColor: '#e6ffe6', borderColor: '#99ff99' }}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          disabled={!email || isLoading} 
          className={styles.btnPrimary} 
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {isLoading ? 'Sende Link...' : 'Link anfordern'}
        </button>
        
      </form>
      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
      <div className={styles.links}>
        <Link href="/login">Zurück zum Login</Link>
      </div>
    </div>
  );
}