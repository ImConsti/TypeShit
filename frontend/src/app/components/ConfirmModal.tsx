"use client";

import React from "react";
import styles from "./ConfirmModal.module.css";

type Props = {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
    return (
        <div className={styles.backdrop} onClick={onCancel}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.cancelBtn}`} onClick={onCancel} type="button">
                        Abbrechen
                    </button>
                    <button className={`${styles.btn} ${styles.confirmBtn}`} onClick={onConfirm} type="button">
                        Löschen
                    </button>
                </div>
            </div>
        </div>
    );
}
