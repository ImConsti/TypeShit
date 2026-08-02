'use client';

import { useEffect, useState } from 'react';
import StatisticsPage, {
  StatisticsData,
} from '@/src/app/components/StatisticsPage';

/** Base URL of the Express backend; localhost is used for local development. */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Client-side route that loads authenticated statistics from the backend and
 * passes the expected response shape to the presentational component.
 */
export default function StatisticsRoute() {
  // Separate state values keep loading, success, and failure rendering explicit.
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Statistics are loaded once when the route is mounted.
    async function loadStatistics() {
      try {
        // The login flow stores the JWT under this key. It is required because
        // /api/statistics is protected by authenticateToken.
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error(
            'Du bist nicht angemeldet. Bitte melde dich erneut an.'
          );
        }

        // Send the JWT in the standard Bearer authorization header.
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

        // Parse the JSON for both successful responses and backend errors.
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Statistiken konnten nicht geladen werden.'
          );
        }

        // StatisticsPage expects this object to match StatisticsData exactly.
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

  // Render mutually exclusive UI states before the statistics page itself.
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
