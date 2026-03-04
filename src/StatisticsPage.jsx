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

const pageStyles = `
.statistics-page {
  --bg: #ece9e3;
  --panel: #f7f4ef;
  --accent: #d9534f;
  --accent-soft: #f09a8e;
  --text: #23211f;
  --muted: #6b6863;
  --border: #d8d1c6;
  --ok: #0fa56f;
  --warn: #e49a2d;

  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 18%, rgba(217, 88, 83, 0.16) 0, transparent 36%),
    radial-gradient(circle at 82% 6%, rgba(15, 165, 111, 0.12) 0, transparent 34%),
    var(--bg);
  color: var(--text);
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  padding: 1.5rem;
}

.statistics-shell {
  max-width: 1120px;
  margin: 0 auto;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.4rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(247, 244, 239, 0.92);
  box-shadow: 0 16px 32px rgba(54, 45, 39, 0.08);
}

.stats-header h1 {
  margin: 0.2rem 0 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1;
}

.stats-header p {
  margin: 0.55rem 0 0;
  color: var(--muted);
  font-size: 0.98rem;
}

.eyebrow {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(90deg, var(--accent) 0%, #e16f65 100%);
}

.date-pill {
  min-width: 220px;
  text-align: right;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.75rem 0.95rem;
}

.date-pill span {
  display: block;
  font-size: 0.85rem;
  color: var(--muted);
}

.date-pill strong {
  display: block;
  margin-top: 0.15rem;
  font-size: 1.05rem;
}

.summary-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 0.75rem;
}

.metric-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--panel);
  padding: 0.85rem;
}

.metric-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-card strong {
  display: block;
  margin-top: 0.4rem;
  font-size: 1.75rem;
}

.metric-card.emphasis {
  background: linear-gradient(120deg, #d9534f 0%, #ec756a 100%);
  color: #fff;
  border-color: #da6d64;
}

.metric-card.emphasis p {
  color: rgba(255, 255, 255, 0.82);
}

.board-grid {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 0.95rem;
}

.panel {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--panel);
  padding: 1rem;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.05);
}

.panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.94rem;
}

.stats-table th,
.stats-table td {
  border: 1px solid var(--border);
  padding: 0.5rem;
  text-align: left;
}

.stats-table th {
  background: #efe8de;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.14rem 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge.high {
  color: #fff;
  background: #c5463f;
}

.badge.medium {
  color: #6a4600;
  background: #f0cf71;
}

.badge.low {
  color: #23583c;
  background: #b7dec6;
}

.status-bars {
  display: grid;
  gap: 0.85rem;
}

.status-row {
  display: grid;
  gap: 0.35rem;
}

.status-row label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.9rem;
}

.status-track {
  height: 12px;
  border-radius: 999px;
  background: #ddd5ca;
  overflow: hidden;
}

.status-fill {
  height: 100%;
  border-radius: inherit;
}

.status-fill.ok {
  background: linear-gradient(90deg, #10a86f 0%, #36c289 100%);
}

.status-fill.danger {
  background: linear-gradient(90deg, #d9534f 0%, #ea7d72 100%);
}

.status-fill.warn {
  background: linear-gradient(90deg, #db9124 0%, #f2b352 100%);
}

.important-list {
  margin: 0;
  padding-left: 1.15rem;
  display: grid;
  gap: 0.35rem;
}

.important-list li {
  color: #352f2a;
}

.week-row {
  display: grid;
  grid-template-columns: 42px 1fr 50px;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.55rem;
}

.week-row span {
  font-size: 0.9rem;
}

.week-track {
  height: 10px;
  border-radius: 999px;
  background: #ddd5ca;
  overflow: hidden;
}

.week-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-soft) 0%, var(--accent) 100%);
}

@media (max-width: 980px) {
  .summary-grid {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
  }

  .board-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .statistics-page {
    padding: 1rem;
  }

  .stats-header {
    flex-direction: column;
    align-items: stretch;
  }

  .date-pill {
    text-align: left;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}
`;

function asPercent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
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

function StatusRow({ label, value, colorClass }) {
  return (
    <div className="status-row">
      <label>
        <span>{label}</span>
        <strong>{value}%</strong>
      </label>
      <div className="status-track">
        <div className={`status-fill ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function StatisticsPage({ stats = defaultStats }) {
  const finishedPercent = asPercent(stats.summary.finished, stats.summary.totalTasks);
  const inProgressPercent = asPercent(stats.summary.inProgress, stats.summary.totalTasks);
  const importantPercent = asPercent(stats.summary.important, stats.summary.totalTasks);

  return (
    <div className="statistics-page">
      <style>{pageStyles}</style>

      <div className="statistics-shell">
        <header className="stats-header">
          <div>
            <span className="eyebrow">Task Analytics</span>
            <h1>Statistics</h1>
            <p>Quick view of throughput, active workload, and completion momentum.</p>
          </div>

          <aside className="date-pill">
            <span>{stats.user.weekday}</span>
            <strong>{stats.user.date}</strong>
            <span>{stats.user.name}</span>
          </aside>
        </header>

        <section className="summary-grid" aria-label="Summary Metrics">
          <article className="metric-card">
            <p>Total Tasks</p>
            <strong>{stats.summary.totalTasks}</strong>
          </article>
          <article className="metric-card">
            <p>Finished</p>
            <strong>{stats.summary.finished}</strong>
          </article>
          <article className="metric-card">
            <p>In Progress</p>
            <strong>{stats.summary.inProgress}</strong>
          </article>
          <article className="metric-card">
            <p>Important</p>
            <strong>{stats.summary.important}</strong>
          </article>
          <article className="metric-card emphasis">
            <p>Streak Days</p>
            <strong>{stats.summary.streakDays}</strong>
          </article>
        </section>

        <section className="board-grid">
          <article className="panel">
            <h2>Open Tasks</h2>
            <table className="stats-table">
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
                      <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    </td>
                    <td>{task.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="panel">
            <h2>Status Breakdown</h2>
            <div className="status-bars">
              <StatusRow label="Finished" value={finishedPercent} colorClass="ok" />
              <StatusRow label="In Progress" value={inProgressPercent} colorClass="danger" />
              <StatusRow label="Important" value={importantPercent} colorClass="warn" />
            </div>
          </article>

          <article className="panel">
            <h2>Important Tasks</h2>
            <ul className="important-list">
              {stats.importantTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
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
