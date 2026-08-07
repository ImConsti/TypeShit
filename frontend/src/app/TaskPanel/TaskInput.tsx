"use client";

import React, { useState } from "react";
import styles from "./TaskInput.module.css"; 
import type { Priority, OpenTaskItem } from "@/src/app/OpenTask/OpenTask";

type TaskInputProps = {
    onAddTask: (task: Omit<OpenTaskItem, "id">) => void;
};

export default function TaskInput({ onAddTask }: TaskInputProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Mittel");
    const [dueDate, setDueDate] = useState("");
    
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    
    // Am Anfang wurde FormEvent genutzt. Mir ist aber erst später aufgefallen, dass es veraltet ist und man stattdessen das SubmitEvent verwenden sollte: 
    // Generell wurde sich im Umgang mit Formularen folgende Dokumentation angeschaut: 
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/
    // https://react.dev/reference/react-dom/components/form
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const cleanTitle = title.trim();
        const cleanDescription = description.trim();

        if (!cleanTitle || cleanTitle.length > 300 || cleanTitle === "") return;

        onAddTask({
            title: cleanTitle,
            description: cleanDescription.length > 5000 ? cleanDescription.slice(0, 5000) : cleanDescription,
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
                    <textarea
                        rows={2}
                        placeholder="Aufgabe..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={300}
                        className={`${styles.inputField} ${styles.inputTitle}`}
                    />
                    <span className={`${styles.counter} ${title.length >= 290 ? styles.warning : ""}`}>
                        {title.length}/300
                    </span>
                </div>
                
                <div className={`${styles.fieldWrapper} ${styles.flex3}`}>
                    <textarea
                        rows={2}
                        placeholder="Beschreibung..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={5000}
                        className={`${styles.inputField} ${styles.inputDesc}`}
                    />
                    <span className={`${styles.counter} ${description.length >= 4980 ? styles.warning : ""}`}>
                        {description.length}/5000
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
                    min={today}
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