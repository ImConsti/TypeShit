'use client';

import { useEffect, useState } from 'react';
import StatisticsPage, {
  StatisticsData,
} from '@/src/app/components/StatisticsPage';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function StatisticsRoute() {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStatistics() {
      try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error(
            'Du bist nicht angemeldet. Bitte melde dich erneut an.'
          );
        }

        const response = await fetch(
          `${API_BASE}/api/statistics`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Statistiken konnten nicht geladen werden.'
          );
        }

        setStats(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Unbekannter Fehler'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStatistics();
  }, []);

  if (isLoading) {
    return <p>Statistiken werden geladen …</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Fehler: {error}</p>;
  }

  if (!stats) {
    return <p>Keine Statistikdaten vorhanden.</p>;
  }

  return <StatisticsPage stats={stats} />;
}
