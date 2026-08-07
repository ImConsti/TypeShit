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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function TasksPanel() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("auth_token");
        fetch(`${API_BASE}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok || !Array.isArray(data)) {
                    console.error("Failed to fetch tasks from server", data);
                    setTasks([]);
                    setIsLoaded(true);
                    return;
                }
                setTasks(data);
                setIsLoaded(true);
            })
            .catch((error) => {
                console.error("Failed to fetch tasks from server", error);
                setIsLoaded(true);
            });

    }, []);

    const handleAddTask = async (newTaskData: Omit<OpenTaskItem, "id">) => {
        try {
            const token= sessionStorage.getItem("auth_token");
            const response = await fetch(`${API_BASE}/api/tasks`, {
                method : "POST", 
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
                body: JSON.stringify(newTaskData),
            });

            if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const savedTask: Task= await response.json();
        setTasks((prev) => [savedTask, ...prev])
        } 
        catch (error: unknown) {
            console.error("Failed to add task to server", error);
        }
        
    };

    const handleUpdate = (updatedTask: OpenTaskItem) => {
        setTasks((prev) => 
            prev.map((task) =>
                task.id === updatedTask.id
                    ? { ...task, ...updatedTask }
                    : task
            )
        );

        const token = sessionStorage.getItem("auth_token");
        fetch(`${API_BASE}/api/tasks/${updatedTask.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                title: updatedTask.title,
                description: updatedTask.description,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
            }),
        }).catch((error) => console.error("Failed to update task on server", error));
    };

    const toggleTask = (id: string, isDone: boolean) => {
        const timeStr = isDone ? new Date().toISOString() : undefined;

        setTasks((prev) => prev.map((t) =>
            t.id === id ? { ...t, isDone, doneAt: timeStr } : t
        ));

        const token = sessionStorage.getItem("auth_token");
        fetch(`${API_BASE}/api/tasks/${id}/complete`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isDone }),
        }).catch((error) => console.error("Failed to update task completion on server", error));
    };

    const removeTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));

        const token = sessionStorage.getItem("auth_token");
        fetch(`${API_BASE}/api/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        }).catch((error) => console.error("Failed to delete task on server", error));
    };

    const openTasksForUI: OpenTaskItem[] = tasks.filter((t) => !t.isDone);
    
    const doneTasksForUI: DoneTaskItem[] = tasks.filter((t) => t.isDone).map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        doneAt: t.doneAt!,
    }));

    return (
        <div className={styles.page}>
            <TaskInput onAddTask={handleAddTask} />
            <OpenTask tasks={openTasksForUI} onUpdate={handleUpdate} onComplete={(id) => toggleTask(id, true)} onRemove={removeTask} />
            <CloseTask doneTasks={doneTasksForUI} onRestore={(id) => toggleTask(id, false)} onRemove={removeTask} />
        </div>
    );
}