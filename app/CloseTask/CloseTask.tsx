import styles from "@/app/TaskPanel/TasksPanel.module.css";
import React, { useMemo, useState } from "react";


export type DoneTaskItem = {
    id: string;
    title: string;
    description: string;
    doneAt: string;
    pinned?: boolean;
};

type SortDone = "Erledigt am";

type CloseTaskProps = {
    doneTasks: DoneTaskItem[];
    onRemove?: (id: string) => void;
    onRestore?: (id: string) => void;
};

export default function CloseTask({ doneTasks, onRemove, onRestore }: CloseTaskProps) {
    const [doneCollapsed, setDoneCollapsed] = useState(false);
    const [doneSort, setDoneSort] = useState<SortDone>("Erledigt am");

    const sortedDone = useMemo(() => {
        const parse = (s: string) => {
            const [datePart, timePart] = s.split(" ");
            const [dd, mm, yyyy] = datePart.split(".").map(Number);
            const [hh, min] = timePart.split(":").map(Number);
            return new Date(yyyy, mm - 1, dd, hh, min).getTime();
        };
        return [...doneTasks].sort((a, b) => parse(b.doneAt) - parse(a.doneAt));
    }, [doneTasks, doneSort]);

    return (
        <section className={styles.card}>
            <header className={styles.cardHeader}>
                <div className={styles.titleRow}>
                    <h2 className={styles.cardTitle}>
                        Erledigte Aufgaben <span className={styles.count}>({doneTasks.length})</span>
                    </h2>

                    <div className={styles.headerRight}>
                        <label className={styles.selectWrap}>
                            <select
                                className={styles.select}
                                value={doneSort}
                                onChange={(e) => setDoneSort(e.target.value as SortDone)}
                                aria-label="Sortierung erledigte Aufgaben"
                            >
                                <option>Erledigt am</option>
                            </select>
                        </label>

                        <button
                            className={styles.collapseBtn}
                            onClick={() => setDoneCollapsed((v) => !v)}
                            aria-label={doneCollapsed ? "Ausklappen" : "Einklappen"}
                            title={doneCollapsed ? "Ausklappen" : "Einklappen"}
                        >
                            {doneCollapsed ? "▾" : "▴"}
                        </button>
                    </div>
                </div>
            </header>

            {!doneCollapsed && (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={styles.colPin} aria-label="Pin" />
                            <th className={styles.colTask}>Aufgabe</th>
                            <th className={styles.colDesc}>Beschreibung</th>
                            <th className={styles.colDoneAt}>Erledigt am</th>
                            <th className={styles.colActions}>Aktionen</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sortedDone.map((t) => (
                            <tr key={t.id}>
                                <td className={styles.pinCell}>
                                    <span className={styles.pin} aria-hidden>📌</span>
                                </td>

                                <td className={styles.taskCell}>
                                    <div className={styles.taskText}>
                                        <div className={`${styles.taskTitle} ${styles.strike}`}>{t.title}</div>
                                    </div>
                                </td>

                                <td className={styles.descCell}>
                                    <div className={styles.desc}>{t.description}</div>
                                </td>

                                <td className={styles.dueCell}>
                                    <span className={styles.date}>{t.doneAt}</span>
                                </td>

                                <td className={styles.actionsCell}>
                                    <button
                                        className={styles.iconBtn}
                                        aria-label="Zurück"
                                        title="Zurück"
                                        onClick={() => onRestore?.(t.id)}
                                    >
                                        →
                                    </button>

                                    <button
                                        className={`${styles.iconBtn} ${styles.trashBtn}`}
                                        onClick={() => onRemove?.(t.id)}
                                        aria-label="Löschen"
                                        title="Löschen"
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {sortedDone.length === 0 && (
                            <tr>
                                <td className={styles.emptyRow} colSpan={5}>
                                    Keine erledigten Aufgaben vorhanden.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}