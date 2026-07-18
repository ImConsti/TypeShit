'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { promoteUser } from '@/src/app/services/userService';

export default function AdminPage() {
  const { role } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (role !== 'admin') {
      router.push('/');
    }
  }, [role, router]);

  if (role !== 'admin') return <p>Zugriff verweigert.</p>;

  // 2. Beförderungs-Logik
  const handlePromote = async () => {
    try {
      await promoteUser(Number(userId));
      setStatus(`Nutzer ${userId} erfolgreich zum Admin befördert!`);
    } catch (err: any) {
      setStatus('Fehler: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ marginTop: '1rem' }}>
        <input 
          placeholder="User ID eingeben" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handlePromote}>User zum Admin machen</button>
      </div>
      {status && <p>{status}</p>}
    </div>
  );
}