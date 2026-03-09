"use client";

import React, { useMemo, useState } from "react";
// Geändert von Marco: Import auf das isolierte Modul korrigiert
import styles from "./OpenTask.module.css"; 

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

    /* Geändert von Marco: Sortier-Logik */
    const sortedOpen = useMemo(() => {
        return [...tasks].sort((a, b) => {
            const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
            const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
            
            return timeA - timeB;
        });
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
                            {/* Geändert von Marco: Native SVGs für ausfallsichere Icons */}
                            {openCollapsed ? (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            )}
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
                                    <span className={styles.pin} aria-hidden>📌</span>
                                </td>

                                <td className={styles.taskCell}>
                                    <label className={styles.taskLabel}>
                                        <input className={styles.checkbox} type="checkbox" aria-label="Aufgabe markieren" onChange={() => onComplete(t.id)} />
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
                                    <span className={styles.date}>
                                        {/* Geändert von Marco: Umwandlung ISO-Datum für das UI in das deutsche Format */}
                                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString("de-DE", { 
                                            day: "2-digit", 
                                            month: "2-digit", 
                                            year: "numeric" 
                                        }) : "—"}
                                    </span>
                                </td>

                                <td className={styles.actionsCell}>
                                    <button
                                        className={`${styles.iconBtn} ${styles.okBtn}`}
                                        onClick={() => onComplete(t.id)}
                                        aria-label="Erledigen"
                                        title="Erledigen"
                                        type="button"
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </button>

                                    <button
                                        className={`${styles.iconBtn} ${styles.editBtn}`}
                                        aria-label="Bearbeiten"
                                        title="Bearbeiten"
                                        type="button"
                                    >
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
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