'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from '@/src/app/login/login.module.css';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setErrorMessage('Kein gültiger Token in der URL gefunden.');
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (newPassword.length < 6) {
      setErrorMessage('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setErrorMessage('');
    setMessage('');
    setIsLoading(true);

    try {
      await resetPassword(token, newPassword);
      setMessage('Passwort erfolgreich geändert! Du kannst dich nun einloggen.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Fehler beim Zurücksetzen des Passworts.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Neues Passwort setzen</h2>
      <form onSubmit={onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Neues Passwort</label>
          <input 
            type="password" 
            id="newPassword" 
            className={styles.formControl} 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required 
            disabled={!token}
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
          disabled={!token || !newPassword || isLoading} 
          className={styles.btnPrimary} 
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {isLoading ? 'Speichere...' : 'Passwort ändern'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}