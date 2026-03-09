"use client";

import styles from "./page.module.css";
import TasksPanel from "@/app/TaskPanel/TasksPanel"; // Dein Import

export default function Home() {
  return (
    <div className={styles.page}>
        <TasksPanel /> {/* Deine Komponente */}
        
        {/* Die neuen Elemente vom Server (Beispielhaft integriert) */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>
                Statistics page: <a href="/statistics">statistics</a>
            </p>
        </div>
    </div>
  );
}