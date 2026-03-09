"use client";

import styles from "./page.module.css";
import TasksPanel from "@/app/TaskPanel/TasksPanel";

export default function Home() {
  return (
    <div className={styles.page}>
        <TasksPanel />
    </div>
  );
}