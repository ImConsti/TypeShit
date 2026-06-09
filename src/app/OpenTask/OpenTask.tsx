"use client";

import React, { useMemo, useState } from "react";
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

type SortOpen = "Fällig am" | "Priorität";

type Props = {
    tasks: OpenTaskItem[];
    onComplete: (id: string) => void;
    onUpdate: (updatedTask: OpenTaskItem) => void;
};

const priorityClass: Record<Priority, string> = {
    Hoch: styles.badgeHigh,
    Mittel: styles.badgeMedium,
    Niedrig: styles.badgeLow,
};

const priorityOrder: Record<Priority, number> = { Hoch: 0, Mittel: 1, Niedrig: 2 };

function useTaskSearch(tasks: OpenTaskItem[]) {
    const [searchQuery, setSearchQuery] = useState("");

    const isFiltered = searchQuery.trim() !== "";

    const filteredTasks = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return tasks;
        return tasks.filter(
            (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        );
    }, [tasks, searchQuery]);

    return { searchQuery, setSearchQuery, filteredTasks, isFiltered};
}

function useTaskSort(tasks: OpenTaskItem[]) {
    const [openSort, setOpenSort] = useState<SortOpen>("Fällig am");

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (openSort === "Priorität") {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
            const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
            return timeA - timeB;
        });
    }, [tasks, openSort]);

    return { openSort, setOpenSort, sortedTasks };
}

export default function OpenTask({ tasks, onComplete, onUpdate }: Props) {
    const [openCollapsed, setOpenCollapsed] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<OpenTaskItem | null>(null);

    const { searchQuery, setSearchQuery, filteredTasks, isFiltered } = useTaskSearch(tasks);
    const { openSort, setOpenSort, sortedTasks } = useTaskSort(filteredTasks);

    const startEditing = (task: OpenTaskItem) => {
        setEditingTaskId(task.id);
        setEditValues({ ...task });
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditValues(null);
    };

    const saveEditing = () => {
        if (!editValues) return;
        onUpdate(editValues);
        setEditingTaskId(null);
        setEditValues(null);
    };

    return (
        <section className={styles.card}>
            <header className={styles.cardHeader}>
                <div className={styles.titleRow}>
                    <h2 className={styles.cardTitle}>
                        Offene Aufgaben{" "}
                        <span className={styles.count}>
                            ({isFiltered ? `${sortedTasks.length}/${tasks.length}` : tasks.length})
                        </span>
                    </h2>

                    <div className={styles.headerRight}>
                        <label className={styles.selectWrap}>
                            <select
                                className={styles.select}
                                value={openSort}
                                onChange={(e) => setOpenSort(e.target.value as SortOpen)}
                                aria-label="Sortierung offene Aufgaben"
                            >
                                <option value="Fällig am">Fällig am</option>
                                <option value="Priorität">Priorität</option>
                            </select>
                        </label>

                        <button
                            className={styles.collapseBtn}
                            onClick={() => setOpenCollapsed((v) => !v)}
                            aria-label={openCollapsed ? "Ausklappen" : "Einklappen"}
                            title={openCollapsed ? "Ausklappen" : "Einklappen"}
                        >
                            {openCollapsed ? (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.filterRow}>
                    <div className={styles.searchWrap}>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            className={styles.searchInput}
                            type="search"
                            placeholder="Aufgaben suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Aufgaben suchen"
                        />
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
                        {sortedTasks.map((t) => {
                            const isEditing = editingTaskId === t.id;

                            return (
                                <tr key={t.id}>
                                    <td className={styles.pinCell}>
                                        <span className={styles.pin} aria-hidden>📌</span>
                                    </td>

                                    <td className={styles.taskCell}>
                                        {isEditing && editValues ? (
                                            <input
                                                className={styles.input}
                                                type="text"
                                                value={editValues.title}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, title: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <label className={styles.taskLabel}>
                                                <input
                                                    className={styles.checkbox}
                                                    type="checkbox"
                                                    aria-label="Aufgabe markieren"
                                                    onChange={() => onComplete(t.id)}
                                                />
                                                <div className={styles.taskText}>
                                                    <div className={styles.taskTitle}>{t.title}</div>
                                                </div>
                                            </label>
                                        )}
                                    </td>

                                    <td className={styles.descCell}>
                                        {isEditing && editValues ? (
                                            <input
                                                className={styles.input}
                                                type="text"
                                                value={editValues.description}
                                                onChange={(e) =>
                                                    setEditValues({ ...editValues, description: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <div className={styles.desc}>{t.description}</div>
                                        )}
                                    </td>

                                    <td className={styles.prioCell}>
                                        {isEditing && editValues ? (
                                            <select
                                                className={styles.input}
                                                value={editValues.priority}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        priority: e.target.value as Priority,
                                                    })
                                                }
                                            >
                                                <option value="Hoch">Hoch</option>
                                                <option value="Mittel">Mittel</option>
                                                <option value="Niedrig">Niedrig</option>
                                            </select>
                                        ) : (
                                            <span className={`${styles.badge} ${priorityClass[t.priority]}`}>
                                                    {t.priority}
                                                </span>
                                        )}
                                    </td>

                                    <td className={styles.dueCell}>
                                        {isEditing && editValues ? (
                                            <input
                                                className={styles.input}
                                                type="date"
                                                value={editValues.dueDate ?? ""}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues,
                                                        dueDate: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <span className={styles.date}>
                                                    {t.dueDate
                                                        ? new Date(t.dueDate).toLocaleDateString("de-DE", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        : "—"}
                                                </span>
                                        )}
                                    </td>

                                    <td className={styles.actionsCell}>
                                        {isEditing ? (
                                            <div className={styles.editActions}>
                                                <button
                                                    className={`${styles.iconBtn} ${styles.saveBtn}`}
                                                    onClick={saveEditing}
                                                    type="button"
                                                >
                                                    Speichern
                                                </button>

                                                <button
                                                    className={`${styles.iconBtn} ${styles.cancelBtn}`}
                                                    onClick={cancelEditing}
                                                    type="button"
                                                >
                                                    Abbrechen
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className={`${styles.iconBtn} ${styles.okBtn}`}
                                                    onClick={() => onComplete(t.id)}
                                                    aria-label="Erledigen"
                                                    title="Erledigen"
                                                    type="button"
                                                >
                                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </button>

                                                <button
                                                    className={`${styles.iconBtn} ${styles.editBtn}`}
                                                    aria-label="Bearbeiten"
                                                    title="Bearbeiten"
                                                    type="button"
                                                    onClick={() => startEditing(t)}
                                                >
                                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {sortedTasks.length === 0 && (
                        <div className={styles.footerHint}>
                            {isFiltered ? "Keine Aufgaben entsprechen den Filterkriterien." : "Keine offenen Aufgaben vorhanden."}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}