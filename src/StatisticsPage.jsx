import React from "react";

const defaultStats = {
  user: {
    name: "Michael Lippert",
    email: "michigen5@gmail.com",
    weekday: "Friday",
    date: "30/01/2026",
  },
  summary: {
    totalTasks: 84,
    finished: 29,
    inProgress: 55,
    important: 4,
    streakDays: 9,
  },
  openTasks: [
    { title: "Prepare sprint review", priority: "High", due: "24.04.2024" },
    { title: "Type safety cleanup", priority: "Medium", due: "27.04.2024" },
    { title: "Refactor reminder module", priority: "Low", due: "30.04.2024" },
  ],
  importantTasks: ["Prepare sprint review", "Fix dashboard bugs", "Plan milestone release"],
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

const pageStyles = `
.stats-layout {
  --bg: #ebebeb;
  --panel: #f4f4f4;
  --sidebar: #ff575c;
  --sidebar-light: #ff8588;
  --topbar: #e7dece;
  --text: #1f1f1f;
  --muted: #666;
  --border: #d2d2d2;
  --ok: #15b86d;
  --danger: #ff2e35;
  --accent: #ff575c;
  --font: "Poppins", "Segoe UI", "Trebuchet MS", sans-serif;

  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  border: 1px solid #e0e0e0;
  min-height: 100vh;
}

.stats-topbar {
  background: var(--topbar);
  border-bottom: 1px solid #e2d7c4;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.4rem;
}

.stats-topbar h1 {
  margin: 0;
  font-size: 2rem;
  line-height: 1;
}

.stats-search {
  flex: 1;
  border: none;
  height: 2rem;
  border-radius: 999px;
  background: #f4f2ec;
  padding: 0 1rem;
  font-size: 1.1rem;
  color: #8d8d8d;
}

.stats-icons {
  display: flex;
  gap: 0.45rem;
}

.stats-icon {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  font-weight: 600;
}

.stats-day {
  text-align: right;
  line-height: 1.2;
  min-width: 80px;
}

.stats-day strong {
  font-size: 1.5rem;
}

.stats-day span {
  display: block;
  color: var(--accent);
  font-weight: 600;
  margin-top: 0.1rem;
}

.stats-shell {
  display: grid;
  grid-template-columns: 235px 1fr;
  min-height: calc(100vh - 66px);
}

.stats-sidebar {
  background: linear-gradient(180deg, var(--sidebar) 0%, #ff5256 100%);
  color: #fff;
  padding: 1.35rem 1rem;
}

.stats-avatar {
  width: 95px;
  height: 95px;
  border-radius: 999px;
  margin: 0 auto 0.95rem;
  background: radial-gradient(circle at 45% 35%, #cfecfb 0%, #a7d9f3 35%, #8db4d8 100%);
  border: 5px solid rgba(255, 255, 255, 0.35);
}

.stats-user {
  text-align: center;
  margin-bottom: 1.2rem;
}

.stats-user h2 {
  margin: 0;
  font-size: 1.35rem;
}

.stats-user p {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  opacity: 0.95;
}

.stats-nav {
  display: grid;
  gap: 0.8rem;
}

.stats-nav button {
  border: 0;
  border-radius: 10px;
  padding: 0.7rem 0.85rem;
  background: rgba(255, 255, 255, 0.42);
  color: #fff;
  font-family: var(--font);
  text-align: left;
  font-size: 1.1rem;
  cursor: default;
}

.stats-nav button.active {
  background: #fff;
  color: var(--accent);
  font-weight: 600;
}

.stats-main {
  padding: 1.5rem;
}

.stats-main h3 {
  margin: 0 0 1.1rem;
  font-size: 2.2rem;
}

.stats-board {
  border: 4px solid #d0d0d0;
  background: #ededed;
  padding: 1.1rem;
  display: grid;
  grid-template-columns: 1.2fr 0.95fr;
  gap: 1rem;
}

.stats-card {
  background: var(--panel);
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  padding: 1rem;
  animation: card-in 0.45s ease both;
}

.stats-card h4 {
  margin: 0 0 0.7rem;
  color: var(--accent);
  font-size: 1.95rem;
  font-weight: 500;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(90px, 1fr));
  gap: 0.55rem;
  margin-bottom: 0.8rem;
}

.metric-item {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.45rem 0.55rem;
}

.metric-item p {
  margin: 0;
  font-size: 0.76rem;
  color: var(--muted);
}

.metric-item strong {
  font-size: 1.2rem;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.stats-table th,
.stats-table td {
  border: 1px solid var(--border);
  padding: 0.45rem;
  text-align: left;
}

.stats-table th {
  background: #f0f0f0;
  font-weight: 600;
}

.badge {
  display: inline-block;
  border-radius: 7px;
  padding: 0.12rem 0.42rem;
  font-weight: 600;
}

.badge.high {
  color: #fff;
  background: #d05d48;
}

.badge.medium {
  color: #6f5400;
  background: #f3d36d;
}

.badge.low {
  color: #3e6950;
  background: #a6d9bf;
}

.status-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.ring-box {
  text-align: center;
}

.ring {
  --percent: 50;
  --ring-color: #000;
  width: 118px;
  aspect-ratio: 1;
  margin: 0 auto 0.45rem;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) calc(var(--percent) * 1%), #d8d8d8 0);
  display: grid;
  place-items: center;
}

.ring::before {
  content: "";
  width: 72px;
  aspect-ratio: 1;
  background: var(--panel);
  border-radius: 50%;
}

.ring-value {
  margin-top: -73px;
  font-size: 2rem;
  font-weight: 600;
}

.ring-box p {
  margin: 0.5rem 0 0;
  font-size: 1.95rem;
}

.important-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 1.7rem;
  line-height: 1.55;
}

.week-card {
  margin-top: 1rem;
}

.week-row {
  display: grid;
  grid-template-columns: 55px 1fr 44px;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.week-row span {
  font-size: 0.9rem;
}

.week-track {
  height: 10px;
  border-radius: 999px;
  background: #d9d9d9;
  overflow: hidden;
}

.week-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff8185 0%, var(--accent) 100%);
}

@keyframes card-in {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 1080px) {
  .stats-board {
    grid-template-columns: 1fr;
  }

  .metrics {
    grid-template-columns: repeat(3, minmax(90px, 1fr));
  }
}

@media (max-width: 860px) {
  .stats-shell {
    grid-template-columns: 1fr;
  }

  .stats-sidebar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.45);
  }

  .stats-nav {
    grid-template-columns: repeat(3, minmax(130px, 1fr));
  }
}

@media (max-width: 640px) {
  .stats-topbar {
    flex-wrap: wrap;
  }

  .stats-day {
    min-width: unset;
    text-align: left;
  }

  .metrics {
    grid-template-columns: repeat(2, minmax(90px, 1fr));
  }

  .status-wrap {
    grid-template-columns: 1fr;
  }

  .stats-card h4 {
    font-size: 1.45rem;
  }

  .ring-box p {
    font-size: 1.4rem;
  }

  .important-list {
    font-size: 1.2rem;
  }
}
`;

function asPercent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function RingStat({ label, percent, color }) {
  return (
    <article className="ring-box">
      <div
        className="ring"
        style={{
          "--percent": percent,
          "--ring-color": color,
        }}
      />
      <div className="ring-value">{percent}%</div>
      <p>{label}</p>
    </article>
  );
}

function WeeklyRow({ day, done, total }) {
  const percent = asPercent(done, total);
  return (
    <div className="week-row">
      <span>{day}</span>
      <div className="week-track">
        <div className="week-fill" style={{ width: `${percent}%` }} />
      </div>
      <span>{`${done}/${total}`}</span>
    </div>
  );
}

export default function StatisticsPage({ stats = defaultStats }) {
  const finishedPercent = asPercent(stats.summary.finished, stats.summary.totalTasks);
  const inProgressPercent = asPercent(stats.summary.inProgress, stats.summary.totalTasks);

  return (
    <div className="stats-layout">
      <style>{pageStyles}</style>

      <header className="stats-topbar">
        <h1>Dashboard</h1>
        <input className="stats-search" value="" readOnly placeholder="Search your tasks here..." />
        <div className="stats-icons">
          <span className="stats-icon">Q</span>
          <span className="stats-icon">+</span>
          <span className="stats-icon">C</span>
        </div>
        <div className="stats-day">
          <strong>{stats.user.weekday}</strong>
          <span>{stats.user.date}</span>
        </div>
      </header>

      <div className="stats-shell">
        <aside className="stats-sidebar">
          <div className="stats-avatar" />
          <div className="stats-user">
            <h2>{stats.user.name}</h2>
            <p>{stats.user.email}</p>
          </div>

          <nav className="stats-nav">
            <button type="button">Dashboard</button>
            <button type="button">Important Tasks</button>
            <button type="button">My Tasks</button>
            <button type="button" className="active">
              Stats
            </button>
            <button type="button">Settings</button>
            <button type="button">Info</button>
          </nav>
        </aside>

        <main className="stats-main">
          <h3>Statistics Overview</h3>

          <section className="stats-board">
            <article className="stats-card">
              <h4>Task Metrics</h4>
              <div className="metrics">
                <div className="metric-item">
                  <p>Total</p>
                  <strong>{stats.summary.totalTasks}</strong>
                </div>
                <div className="metric-item">
                  <p>Finished</p>
                  <strong>{stats.summary.finished}</strong>
                </div>
                <div className="metric-item">
                  <p>In Progress</p>
                  <strong>{stats.summary.inProgress}</strong>
                </div>
                <div className="metric-item">
                  <p>Important</p>
                  <strong>{stats.summary.important}</strong>
                </div>
                <div className="metric-item">
                  <p>Streak</p>
                  <strong>{stats.summary.streakDays}d</strong>
                </div>
              </div>

              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.openTasks.map((item) => (
                    <tr key={item.title}>
                      <td>{item.title}</td>
                      <td>
                        <span className={`badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
                      </td>
                      <td>{item.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <div>
              <article className="stats-card">
                <h4>Status</h4>
                <div className="status-wrap">
                  <RingStat label="Finished" percent={finishedPercent} color="#16b56e" />
                  <RingStat label="In Progress" percent={inProgressPercent} color="#ff3238" />
                </div>
              </article>

              <article className="stats-card" style={{ marginTop: "1rem" }}>
                <h4>Important Tasks</h4>
                <ul className="important-list">
                  {stats.importantTasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <article className="stats-card week-card">
            <h4>Weekly Completion</h4>
            {stats.weeklyCompletion.map((item) => (
              <WeeklyRow key={item.day} day={item.day} done={item.done} total={item.total} />
            ))}
          </article>
        </main>
      </div>
    </div>
  );
}
