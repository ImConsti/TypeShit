"use client";

import React, { useState } from "react";
import styles from "./TasksPanel.module.css";
import OpenTask, { OpenTaskItem } from "@/app/OpenTask/OpenTask";
import CloseTask, { DoneTaskItem } from "@/app/CloseTask/CloseTask";

//Array, mit Items Type OpenTaskItem
const sampleOpen: OpenTaskItem[] = [
    {
        id: "o1",
        title: "Vollständige Induktion lernen",
        description: "Aufgabe 12-16",
        priority: "Mittel",
        dueDate: "15.04.2026",
        pinned: true,
    },
    {
        id: "o2",
        title: "Digitaltechnik Hausaufgaben",
        description: "Arbeitsblatt bearbeiten",
        priority: "Hoch",
        dueDate: "10.03.2026",
        pinned: false,
    },
    {
        id: "o3",
        title: "Web Engineering I",
        description: "Zwischenabgabe 2",
        priority: "Niedrig",
        dueDate: undefined,
        pinned: true,
    },
];

//Array, mit Items Type DoneTaskItem
const sampleDone: DoneTaskItem[] = [
    {
        id: "d1",
        title: "BWL Abgabe",
        description: "GuV-Rechnung erledigen",
        doneAt: "27.02.2026 20:23",
        pinned: true,
    },
    {
        id: "d2",
        title: "Projektmanagement",
        description: "Gantt-Chart zur Hochzeitsplanung erstellen",
        doneAt: "19.02.2026 18:12",
        pinned: false,
    },
];


export default function TasksPanel() {
    //Offene Aufgaben Array in react-state
    const [openTasks, setOpenTasks] = useState<OpenTaskItem[]>(sampleOpen);
    //Erledigte Aufgaben Array in react-state
    const [doneTasks, setDoneTasks] = useState<DoneTaskItem[]>(sampleDone);

    //AUFGABE VON OFFEN ZU GESCHLOSSEN

    const completeTask = (id: string) => {
        //Aufgabe anhand der ID aus dem Array finden
        const task = openTasks.find((t) => t.id === id);
        //Falls Aufgabe nicht gefunden, abbrechen
        if (!task) return;

        //aktuelles Datum und Uhrzeit ermitteln
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");

        //movedToDone mit alten und neuen Daten definieren
        const movedToDone: DoneTaskItem = {
            id: `d_${task.id}_${crypto.randomUUID()}`,
            title: task.title.replace("Zu erledigende", "Erledigte"),
            description: task.description,
            doneAt: `${dd}.${mm}.${yyyy} ${hh}:${min}`,
            pinned: task.pinned,
        };

        //Aufgabe aus dem Array entfernen anhand der ID
        setOpenTasks((prev) => prev.filter((t) => t.id !== id));

        //Ehem. offene Aufgabe in erledigte Aufgaben-Array hinzufügen
        setDoneTasks((prev) => [movedToDone, ...prev]);
    };

    //AUFGABE VON GESCHLOSSEN ZU OFFEN

    const restoreTask = (doneId: string) => {
        //Aufgabe anhand der ID aus dem Array finden
        const task = doneTasks.find((t) => t.id === doneId);
        //Falls Aufgabe nicht gefunden, abbrechen
        if (!task) return;

        //restoredToOpen mit alten und neuen Daten definieren
        const restoredToOpen: OpenTaskItem = {
            id: task.id.replace(/^d_/, "").replace(/_.+$/, ""),
            title: task.title.replace("Erledigte", "Zu erledigende"),
            description: task.description,
            priority: "Mittel",
            dueDate: undefined,
            pinned: task.pinned,
        };

        //Aufgabe aus dem Array entfernen anhand der ID
        setDoneTasks((prev) => prev.filter((t) => t.id !== doneId));

        //Ehem. erledigte Aufgabe in offene Aufgaben-Array hinzufügen
        setOpenTasks((prev) => [restoredToOpen, ...prev]);
    };

    const removeDone = (id: string) => {
        setDoneTasks((p) => p.filter((x) => x.id !== id));
    };

    return (
        <div className={styles.page}>
            <OpenTask tasks={openTasks} onComplete={completeTask} />
            <CloseTask doneTasks={doneTasks} onRestore={restoreTask} onRemove={removeDone} />
        </div>
    );
}