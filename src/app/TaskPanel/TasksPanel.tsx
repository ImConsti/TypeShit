"use client";

import React, { useState, useEffect } from "react";
import styles from "./TasksPanel.module.css";
import OpenTask, { OpenTaskItem } from "@/src/app/OpenTask/OpenTask";
import CloseTask, { DoneTaskItem } from "@/src/app/CloseTask/CloseTask";
import TaskInput from "./TaskInput";

export type Task = OpenTaskItem & {
    isDone: boolean;
    doneAt?: string;
};

const STORAGE_KEY = "task-manager-tasks";

export default function TasksPanel() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setTasks(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks, isLoaded]);

    const handleAddTask = (newTaskData: Omit<OpenTaskItem, "id" | "pinned">) => {
        setTasks((prev) => [
            { 
                ...newTaskData, 
                id: `t_${crypto.randomUUID()}`, 
                isDone: false, 
                pinned: false 
            },
            ...prev
        ]);
    };

    const handleUpdate = (updatedTask: OpenTaskItem) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === updatedTask.id
                    ? { ...task, ...updatedTask }
                    : task
            )
        );
    };

    const toggleTask = (id: string, isDone: boolean) => {
        const timeStr = isDone ? new Date().toISOString() : undefined;

        setTasks((prev) => prev.map((t) => 
            t.id === id ? { ...t, isDone, doneAt: timeStr } : t
        ));
    };

    const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

    const openTasksForUI: OpenTaskItem[] = tasks.filter((t) => !t.isDone);
    
    const doneTasksForUI: DoneTaskItem[] = tasks.filter((t) => t.isDone).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        doneAt: t.doneAt!, 
        pinned: t.pinned
    }));

    return (
        <div className={styles.page}>
            <TaskInput onAddTask={handleAddTask} />
            <OpenTask tasks={openTasksForUI} onUpdate={handleUpdate} onComplete={(id) => toggleTask(id, true)} />
            <CloseTask doneTasks={doneTasksForUI} onRestore={(id) => toggleTask(id, false)} onRemove={removeTask} />
        </div>
    );
}