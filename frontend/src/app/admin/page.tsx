'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
import { promoteUser, fetchUsers, demoteUser, deleteUser } from '@/src/app/services/userService';
import styles from './admin.module.css';

interface UserData {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const { role, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<UserData[]>([]);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/');
      return;
    }
    loadUsers();
  }, [role, isAuthenticated, router]);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUserList(data);
    } catch (error) {
      setStatus({ message: 'Fehler beim Laden der Nutzerliste', type: 'error' });
    }
  };

  if (role !== 'admin') return null;

  const handlePromote = async () => {
    if (!userId.trim()) return;
    setIsLoading(true);
    setStatus(null);
    
    try {
      await promoteUser(Number(userId));
      setStatus({ message: `Nutzer mit ID ${userId} wurde Admin!`, type: 'success' });
      setUserId('');
      loadUsers();
    } catch (err: any) {
      setStatus({ message: `Fehler: ${err.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemote = async (id: number) => {
    try {
      await demoteUser(id);
      setStatus({ message: `Nutzer mit ID ${id} ist wieder User.`, type: 'success' });
      loadUsers();
    } catch (err: any) {
      setStatus({ message: `Fehler: ${err.message}`, type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Nutzer wirklich löschen?')) return;
    try {
      await deleteUser(id);
      setStatus({ message: `Nutzer mit ID ${id} gelöscht.`, type: 'success' });
      loadUsers();
    } catch (err: any) {
      setStatus({ message: `Fehler: ${err.message}`, type: 'error' });
    }
  };

  return (
    <main className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <Link href="/" className={styles.navButton}>
          &larr; Zurück zum Dashboard
        </Link>
      </header>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Nutzerverwaltung</h2>
        
        <div className={styles.inputGroup}>
          <input
            type="number"
            className={styles.input}
            placeholder="User ID (z.B. 2)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromote()}
          />
          <button 
            className={styles.button} 
            onClick={handlePromote}
            disabled={isLoading || !userId}
          >
            {isLoading ? 'Verarbeite...' : 'Zum Admin machen'}
          </button>
        </div>

        {status && (
          <div className={`${styles.statusMessage} ${status.type === 'error' ? styles.statusError : ''}`}>
            {status.message}
          </div>
        )}

        <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.5rem' }}>ID</th>
              <th style={{ padding: '0.5rem' }}>E-Mail</th>
              <th style={{ padding: '0.5rem' }}>Rolle</th>
              <th style={{ padding: '0.5rem' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.5rem' }}>{u.id}</td>
                <td style={{ padding: '0.5rem' }}>{u.email}</td>
                <td style={{ padding: '0.5rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '4px', 
                    backgroundColor: u.role === 'admin' ? '#ffebee' : '#e8f5e9',
                    color: u.role === 'admin' ? '#c62828' : '#2e7d32',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.5rem' }}>
                  {u.role === 'admin' && (
                    <button 
                      onClick={() => handleDemote(u.id)}
                      style={{ marginRight: '8px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                    >
                      Rechte entziehen
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(u.id)}
                    style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', backgroundColor: '#ffebee', border: '1px solid #c62828', color: '#c62828' }}
                  >
                    Loeschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}