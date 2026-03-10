'use client';

import Link from 'next/link';
import TasksPanel from '@/src/app/TaskPanel/TasksPanel';
import { useAuth } from '@/src/contexts/AuthContext';
import styles from './page.module.css';

export default function Home() {
  const { logout } = useAuth();

  return (
    <main className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Task Dashboard</h1>
        <div className={styles.headerActions}>
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