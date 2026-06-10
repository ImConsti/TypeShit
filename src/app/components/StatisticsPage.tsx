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
    weekday: "Thursday",
    date: "June 11, 2026",
  },
  summary: {
    totalTasks: 84,
    finished: 29,
    inProgress: 55,
    important: 4,
    streakDays: 9,
  },
  openTasks: [
    { title: "Prepare sprint review", priority: "High", due: "Mar 6, 2026" },
    { title: "Type safety cleanup", priority: "Medium", due: "Mar 8, 2026" },
    { title: "Refactor reminder module", priority: "Low", due: "Mar 10, 2026" },
  ],
  importantTasks: ["Prepare sprint review", "Fix sync race condition", "Plan milestone release"],
  weeklyCompletion: [
    { day: "Mon", done: 6, total: 8 },
    { day: "Tue", done: 7, total: 9 },
    { day: "Wed", done: 5, total: 7 },
    { day: "Thu", done: 8, total: 10 },
    { day: "Fri", done: 9, total: 11 },
    { day: "Sat", done: 4, total: 6 },
    { day: "Sun", done: 3, total: 5 },
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
            <span className={styles.eyebrow}>Task Analytics</span>
            <h1>Statistics</h1>
            <p>Quick view of throughput, active workload, and completion momentum.</p>
          </div>

          <aside className={styles.datePill}>
            <span>{stats.user.weekday}</span>
            <strong>{stats.user.date}</strong>
            <span>{stats.user.name}</span>
          </aside>
        </header>

        <section className={styles.summaryGrid} aria-label="Summary Metrics">
          <article className={styles.metricCard}>
            <p>Total Tasks</p>
            <strong>{stats.summary.totalTasks}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>Finished</p>
            <strong>{stats.summary.finished}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>In Progress</p>
            <strong>{stats.summary.inProgress}</strong>
          </article>
          <article className={styles.metricCard}>
            <p>Important</p>
            <strong>{stats.summary.important}</strong>
          </article>
          <article className={`${styles.metricCard} ${styles.emphasis}`}>
            <p>Streak Days</p>
            <strong>{stats.summary.streakDays}</strong>
          </article>
        </section>

        <section className={styles.boardGrid}>
          <article className={styles.panel}>
            <h2>Open Tasks</h2>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {stats.openTasks.map((task) => (
                  <tr key={task.title}>
                    <td>{task.title}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[task.priority.toLowerCase()]}`}>
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
              <h2>Status Breakdown</h2>

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
                <StatusRow label="Finished" value={finishedPercent} colorClass="ok" />
                <StatusRow label="In Progress" value={inProgressPercent} colorClass="danger" />
                <StatusRow label="Important" value={importantPercent} colorClass="warn" />
              </div>
            ) : (
              <div className={styles.donutContainer}>
                <div
                  className={styles.donutRing}
                  style={{ '--finished-pct': `${finishedPercent}%` } as React.CSSProperties}
                >
                  <div className={styles.donutInner}>
                    <div className={styles.donutTotal}>{stats.summary.totalTasks}</div>
                    <div className={styles.donutLabel}>Total</div>
                  </div>
                </div>
                
                <div className={styles.donutLegend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.legendOk}`}></div>
                    <div className={styles.legendText}>
                      <span>Finished</span>
                      <small>{stats.summary.finished} Tasks ({finishedPercent}%)</small>
                    </div>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.legendDanger}`}></div>
                    <div className={styles.legendText}>
                      <span>In Progress</span>
                      <small>{stats.summary.inProgress} Tasks ({inProgressPercent}%)</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>

          <article className={styles.panel}>
            <h2>Important Tasks</h2>
            <ul className={styles.importantList}>
              {stats.importantTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <h2>Weekly Completion</h2>
            {stats.weeklyCompletion.map((item) => (
              <WeeklyRow key={item.day} day={item.day} done={item.done} total={item.total} />
            ))}
          </article>
        </section>
      </div>
    </div>
  );
}