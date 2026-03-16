'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './StatisticsPage.module.css';

const defaultStats = {
  user: {
    name: "Michael Lippert",
    email: "michigen5@gmail.com",
    weekday: "Wednesday",
    date: "March 4, 2026",
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

function asPercent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function WeeklyRow({ day, done, total }) {
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

function StatusRow({ label, value, colorClass }) {
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

function CircleStat({ label, value, ringColorClass }) {
  return (
    <div className={styles.circleStat}>
      <div
        className={`${styles.circleRing} ${styles[ringColorClass]}`}
        style={{ '--percent': value }}
      >
        <div className={styles.circleInner}>{value}%</div>
      </div>
      <span className={styles.circleLabel}>{label}</span>
    </div>
  );
}

export default function StatisticsPage({ stats = defaultStats }) {
  const [statusView, setStatusView] = useState('bars');

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const finishedPercent = asPercent(stats.summary.finished, stats.summary.totalTasks);
  const inProgressPercent = asPercent(stats.summary.inProgress, stats.summary.totalTasks);
  const importantPercent = asPercent(stats.summary.important, stats.summary.totalTasks);

  useEffect(() => {
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
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
              <div className={styles.circleStats}>
                <CircleStat label="Finished" value={finishedPercent} ringColorClass="ringOk" />
                <CircleStat label="In Progress" value={inProgressPercent} ringColorClass="ringDanger" />
                <CircleStat label="Important" value={importantPercent} ringColorClass="ringWarn" />
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