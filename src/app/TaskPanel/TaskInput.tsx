"use client";

import React, { useState } from "react";
import styles from "./TaskInput.module.css"; 
import type { Priority, OpenTaskItem } from "@/src/app/OpenTask/OpenTask";

type TaskInputProps = {
    onAddTask: (task: Omit<OpenTaskItem, "id" | "pinned">) => void;
};

export default function TaskInput({ onAddTask }: TaskInputProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Mittel");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle || cleanTitle.length > 200) return;

        onAddTask({
            title: cleanTitle,
            description: cleanDescription.length > 500 ? cleanDescription.slice(0, 500) : cleanDescription,
            priority,
            dueDate: dueDate ? dueDate : undefined,
        });

        setTitle("");
        setDescription("");
        setPriority("Mittel");
        setDueDate("");
    };

    return (
        <form onSubmit={handleSubmit} className={styles.card}>
            <header className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Neue Aufgabe erstellen</h2>
            </header>
            
            <div className={styles.inputGroup}>
                <div className={`${styles.fieldWrapper} ${styles.flex2}`}>
                    <input
                        type="text"
                        placeholder="Aufgabe..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={200}
                        className={`${styles.inputField} ${styles.inputTitle}`}
                    />
                    <span className={`${styles.counter} ${title.length >= 190 ? styles.warning : ""}`}>
                        {title.length}/200
                    </span>
                </div>
                
                <div className={`${styles.fieldWrapper} ${styles.flex3}`}>
                    <input
                        type="text"
                        placeholder="Beschreibung..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        className={`${styles.inputField} ${styles.inputDesc}`}
                    />
                    <span className={`${styles.counter} ${description.length >= 480 ? styles.warning : ""}`}>
                        {description.length}/500
                    </span>
                </div>
                
                <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className={`${styles.inputField} ${styles.prioritySelect}`}
                >
                    <option value="Hoch">Hoch</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Niedrig">Niedrig</option>
                </select>

                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`${styles.inputField} ${styles.dateInput}`}
                />

                <button type="submit" className={styles.submitBtn}>
                    Hinzufügen
                </button>
            </div>
        </form>
    );
}