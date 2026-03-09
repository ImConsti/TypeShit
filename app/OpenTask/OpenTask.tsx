"use client";

import React, { useMemo, useState } from "react";
import styles from "@/app/TaskPanel/TasksPanel.module.css";

export type Priority = "Hoch" | "Mittel" | "Niedrig";

export type OpenTaskItem = {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string;
    pinned?: boolean;
};

type SortOpen = "Fällig am";

type Props = {
    tasks: OpenTaskItem[];
    onComplete: (id: string) => void;
};

const priorityClass: Record<Priority, string> = {
    Hoch: styles.badgeHigh,
    Mittel: styles.badgeMedium,
    Niedrig: styles.badgeLow,
};

export default function OpenTask({ tasks, onComplete }: Props) {
    const [openCollapsed, setOpenCollapsed] = useState(false);
    const [openSort, setOpenSort] = useState<SortOpen>("Fällig am");

    const sortedOpen = useMemo(() => {
        const parse = (s?: string) => {
            if (!s) return Number.POSITIVE_INFINITY;
            const [dd, mm, yyyy] = s.split(".").map(Number);
            return new Date(yyyy, mm - 1, dd).getTime();
        };
        return [...tasks].sort((a, b) => parse(a.dueDate) - parse(b.dueDate));
    }, [tasks, openSort]);

    return (
        <section className={styles.card}>
            <header className={styles.cardHeader}>
                <div className={styles.titleRow}>
                    <h2 className={styles.cardTitle}>
                        Offene Aufgaben <span className={styles.count}>({tasks.length})</span>
                    </h2>

                    <div className={styles.headerRight}>
                        <label className={styles.selectWrap}>
                            <select
                                className={styles.select}
                                value={openSort}
                                onChange={(e) => setOpenSort(e.target.value as SortOpen)}
                                aria-label="Sortierung offene Aufgaben"
                            >
                                <option>Fällig am</option>
                            </select>
                        </label>

                        <button
                            className={styles.collapseBtn}
                            onClick={() => setOpenCollapsed((v) => !v)}
                            aria-label={openCollapsed ? "Ausklappen" : "Einklappen"}
                            title={openCollapsed ? "Ausklappen" : "Einklappen"}
                        >
                            {openCollapsed ? "▾" : "▴"}
                        </button>
                    </div>
                </div>
            </header>

            {!openCollapsed && (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={styles.colPin} aria-label="Pin" />
                            <th className={styles.colTask}>Aufgabe</th>
                            <th className={styles.colDesc}>Beschreibung</th>
                            <th className={styles.colPrio}>Priorität</th>
                            <th className={styles.colDue}>Fällig am</th>
                            <th className={styles.colActions}>Aktionen</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sortedOpen.map((t) => (
                            <tr key={t.id}>
                                <td className={styles.pinCell}>
                    <span className={styles.pin} aria-hidden>
                      📌
                    </span>
                                </td>

                                <td className={styles.taskCell}>
                                    <label className={styles.taskLabel}>
                                        <input className={styles.checkbox} type="checkbox" aria-label="Aufgabe markieren" />
                                        <div className={styles.taskText}>
                                            <div className={styles.taskTitle}>{t.title}</div>
                                        </div>
                                    </label>
                                </td>

                                <td className={styles.descCell}>
                                    <div className={styles.desc}>{t.description}</div>
                                </td>

                                <td className={styles.prioCell}>
                                    <span className={`${styles.badge} ${priorityClass[t.priority]}`}>{t.priority}</span>
                                </td>

                                <td className={styles.dueCell}>
                                    <span className={styles.date}>{t.dueDate ?? "—"}</span>
                                </td>

                                <td className={styles.actionsCell}>
                                    <button
                                        className={`${styles.iconBtn} ${styles.okBtn}`}
                                        onClick={() => onComplete(t.id)}
                                        aria-label="Erledigen"
                                        title="Erledigen"
                                        type="button"
                                    >
                                        ✓
                                    </button>

                                    <button
                                        className={`${styles.iconBtn} ${styles.editBtn}`}
                                        aria-label="Bearbeiten"
                                        title="Bearbeiten"
                                        type="button"
                                    >
                                        ✎
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {sortedOpen.length === 0 && (
                            <tr>
                                <td className={styles.emptyRow} colSpan={6}>
                                    Keine offenen Aufgaben vorhanden.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                    {sortedOpen.length === 0 && <div className={styles.footerHint}>Keine offenen Aufgaben vorhanden.</div>}
                </div>
            )}
        </section>
    );
}