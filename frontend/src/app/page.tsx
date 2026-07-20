'use client';
import Link from 'next/link';
import TasksPanel from '@/src/app/TaskPanel/TasksPanel';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './page.module.css';

export default function Home() {
  // WICHTIG: role aus useAuth() importieren!
  const { logout, role } = useAuth();

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Task Dashboard</h1>
        <div className={styles.headerActions}>
          
          {/* Dieser Button erscheint NUR, wenn role === 'admin' ist */}
          {role === 'admin' && (
            <Link href="/admin" className={styles.navButton} style={{ backgroundColor: '#1a202c', marginRight: '8px' }}>
              Admin-Bereich
            </Link>
          )}

          <Link href="/statistics" className={styles.navButton}>
            Statistiken ansehen &rarr;
          </Link>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>
             
      <section>
        <TasksPanel />
      </section>
    </main>
  );
}