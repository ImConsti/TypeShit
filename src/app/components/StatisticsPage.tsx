'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './StatisticsPage.module.css';

interface Task {
  title: string;
  priority: string;
  due: string;
}

interface WeeklyCompletion {
  day: string;
  done: number;
  total: number;
}

export interface StatisticsData {
  user: {
    name: string;
    email: string;
    weekday: string;
    date: string;
  };
  summary: {
    totalTasks: number;
    finished: number;
    inProgress: number;
    important: number;
    streakDays: number;
  };
  openTasks: Task[];
  importantTasks: string[];
  weeklyCompletion: WeeklyCompletion[];
}

const defaultStats: StatisticsData = {
  user: {
    name: "Demo User",
    email: "user@example.com",
    weekday: "Donnerstag",
    date: "11. Juni 2026",
  },
  summary: {
    totalTasks: 45,
    finished: 32,
    inProgress: 13,
    important: 5,
    streakDays: 9,
  },
  openTasks: [
    { title: "Präsentation vorbereiten", priority: "Hoch", due: "12. Jun 2026" },
    { title: "Backend-Architektur evaluieren", priority: "Hoch", due: "13. Jun 2026" },
    { title: "Routing-Bug fixen", priority: "Mittel", due: "14. Jun 2026" },
  ],
  importantTasks: ["Präsentation vorbereiten", "Backend-Architektur evaluieren", "Datenbank-Schema entwerfen"],
  weeklyCompletion: [
    { day: "Mo", done: 4, total: 5 },
    { day: "Di", done: 6, total: 7 },
    { day: "Mi", done: 3, total: 3 },
    { day: "Do", done: 5, total: 8 },
    { day: "Fr", done: 7, total: 10 },
    { day: "Sa", done: 4, total: 5 },
    { day: "So", done: 3, total: 7 },
  ],
};

function asPercent(done: number, total: number): number {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

interface WeeklyRowProps {
  day: string;
  done: number;
  total: number;
}

function WeeklyRow({ day, done, total }: WeeklyRowProps) {
  const percent = asPercent(done, total);

  return (
    <div className={styles.weekRow}>
      <span>{day}</span>
      <div className={styles.weekTrack}>
        <div className={styles.weekFill} style={{ width: `${percent}%` }} />
      </div>
      <span>{`${done}/${total}`}</span>
    </div>
  );
}

interface StatusRowProps {
  label: string;
  value: number;
  colorClass: string;
}

function StatusRow({ label, value, colorClass }: StatusRowProps) {
  return (
    <div className={styles.statusRow}>
      <label>
        <span>{label}</span>
        <strong>{value}%</strong>
      </label>
      <div className={styles.statusTrack}>
        <div
          className={`${styles.statusFill} ${styles[colorClass]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

interface StatisticsPageProps {
  stats?: StatisticsData;
}

const priorityClassMap: Record<string, string> = {
  Hoch: styles.high,
  Mittel: styles.medium,
  Niedrig: styles.low
};

export default function StatisticsPage({ stats = defaultStats }: StatisticsPageProps) {
  const [statusView, setStatusView] = useState<'bars' | 'circles'>('bars');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const finishedPercent = asPercent(stats.summary.finished, stats.summary.totalTasks);
  const inProgressPercent = asPercent(stats.summary.inProgress, stats.summary.totalTasks);
  const importantPercent = asPercent(stats.summary.important, stats.summary.totalTasks);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.statisticsPage}>
      <div className={styles.statisticsShell}>

        <div className={styles.navigationRow}>
          <Link href="/" className={styles.backButton}>
            &larr; Zurück zum Dashboard
          </Link>
        </div>

        <header className={styles.statsHeader}>
          <div>
            <span className={styles.eyebrow}>Aufgaben-Analyse</span>
            <h1>Statistiken</h1>
            <p>Schnellübersicht über Durchsatz, Auslastung und Fortschritt.</p>
          </div>

          <aside className={styles.datePill}>
            <span>{stats.user.weekday}</span>
            <strong>{stats.user.date}</strong>
            <span>{stats.user.name}</span>
          </aside>
        </header>

        <section className={styles.summaryGrid} aria-label="Summary Metrics">
          <article className={styles.metricCard}>
            <p>Gesamt</p>
            <strong>{stats.summary.totalTasks}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>Erledigt</p>
            <strong>{stats.summary.finished}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>Offen</p>
            <strong>{stats.summary.inProgress}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>Wichtig</p>
            <strong>{stats.summary.important}</strong>
          </article>
          <article className={`${styles.metricCard} ${styles.emphasis}`}>
            <p>Tage in Folge</p>
            <strong>{stats.summary.streakDays}</strong>
          </article>
        </section>

        <section className={styles.boardGrid}>
          <article className={styles.panel}>
            <h2>Offene Aufgaben</h2>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Aufgabe</th>
                  <th>Priorität</th>
                  <th>Fällig am</th>
                </tr>
              </thead>
              <tbody>
                {stats.openTasks.map((task) => (
                  <tr key={task.title}>
                    <td>{task.title}</td>
                    <td>
                      <span className={`${styles.badge} ${priorityClassMap[task.priority] || ''}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{task.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className={styles.panel}>
            <div className={styles.statusHeader}>
              <h2>Status-Übersicht</h2>

              <div className={styles.menuWrapper} ref={menuRef}>
                <button
                  type="button"
                  className={styles.menuButton}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Ansicht wählen"
                >
                  &#8942;
                </button>

                {menuOpen && (
                  <div className={styles.dropdownMenu}>
                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${statusView === 'bars' ? styles.activeItem : ''}`}
                      onClick={() => {
                        setStatusView('bars');
                        setMenuOpen(false);
                      }}
                    >
                      {statusView === 'bars' ? '✓ ' : ''}Balkenansicht
                    </button>

                    <button
                      type="button"
                      className={`${styles.dropdownItem} ${statusView === 'circles' ? styles.activeItem : ''}`}
                      onClick={() => {
                        setStatusView('circles');
                        setMenuOpen(false);
                      }}
                    >
                      {statusView === 'circles' ? '✓ ' : ''}Kreisansicht
                    </button>
                  </div>
                )}
              </div>
            </div>

            {statusView === 'bars' ? (
              <div className={styles.statusBars}>
                <StatusRow label="Erledigt" value={finishedPercent} colorClass="ok" />
                <StatusRow label="Offen" value={inProgressPercent} colorClass="danger" />
                <StatusRow label="Wichtig" value={importantPercent} colorClass="warn" />
              </div>
            ) : (
              <div className={styles.donutContainer}>
                <div
                  className={styles.donutRing}
                  style={{ '--finished-pct': `${finishedPercent}%` } as React.CSSProperties}
                >
                  <div className={styles.donutInner}>
                    <div className={styles.donutTotal}>{stats.summary.totalTasks}</div>
                    <div className={styles.donutLabel}>Gesamt</div>
                  </div>
                </div>
                
                <div className={styles.donutLegend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.legendOk}`}></div>
                    <div className={styles.legendText}>
                      <span>Erledigt</span>
                      <small>{stats.summary.finished} Aufgaben ({finishedPercent}%)</small>
                    </div>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.legendDanger}`}></div>
                    <div className={styles.legendText}>
                      <span>Offen</span>
                      <small>{stats.summary.inProgress} Aufgaben ({inProgressPercent}%)</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <h2>Wichtige Aufgaben</h2>
            <ul className={styles.importantList}>
              {stats.importantTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <h2>Wöchentlicher Fortschritt</h2>
            {stats.weeklyCompletion.map((item) => (
              <WeeklyRow key={item.day} day={item.day} done={item.done} total={item.total} />
            ))}
          </article>
        </section>
      </div>
    </div>
  );
}