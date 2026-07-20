"use client";

import styles from "./CloseTask.module.css";
import React, { useMemo, useState } from "react";
import ConfirmModal from "@/src/app/components/ConfirmModal";
import DeleteButton from "@/src/app/components/DeleteButton";

export type DoneTaskItem = {
    id: string;
    title: string;
    description: string;
    doneAt: string;
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
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const sortedDone = useMemo(() => {
        return [...doneTasks].sort((a, b) => new Date(b.doneAt).getTime() - new Date(a.doneAt).getTime());
    }, [doneTasks, doneSort]);

    return (
        <>
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
                            {doneCollapsed ? (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {!doneCollapsed && (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th className={styles.colTask}>Aufgabe</th>
                            <th className={styles.colDesc}>Beschreibung</th>
                            <th className={styles.colDoneAt}>Erledigt am</th>
                            <th className={styles.colActions}>Aktionen</th>
                        </tr>
                        </thead>

                        <tbody>
                        {sortedDone.map((t) => (
                            <tr key={t.id}>
                                <td className={styles.taskCell}>
                                    <div className={styles.taskText}>
                                        <div className={`${styles.taskTitle} ${styles.strike}`}>{t.title}</div>
                                    </div>
                                </td>

                                <td className={styles.descCell}>
                                    <div className={styles.desc}>{t.description}</div>
                                </td>

                                <td className={styles.dueCell}>
                                    <span className={styles.date}>
                                        {new Date(t.doneAt).toLocaleString("de-DE", { 
                                            day: "2-digit", 
                                            month: "2-digit", 
                                            year: "numeric", 
                                            hour: "2-digit", 
                                            minute: "2-digit" 
                                        }).replace(",", " ")}
                                    </span>
                                </td>

                                <td className={styles.actionsCell}>
                                    <button
                                        className={`${styles.iconBtn} ${styles.restoreBtn}`} 
                                        aria-label="Zurück"
                                        title="Zurück"
                                        onClick={() => onRestore?.(t.id)}
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                                    </button>

                                    <DeleteButton onClick={() => setPendingDeleteId(t.id)} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {sortedDone.length === 0 && (
                        <div className={styles.footerHint}>Keine erledigten Aufgaben vorhanden.</div>
                    )}
                </div>
            )}
        </section>

        {pendingDeleteId && (
            <ConfirmModal
                message="Aufgabe wirklich löschen?"
                onConfirm={() => { onRemove?.(pendingDeleteId); setPendingDeleteId(null); }}
                onCancel={() => setPendingDeleteId(null)}
            />
        )}
        </>
    );
}