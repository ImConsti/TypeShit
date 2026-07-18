const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const promoteUser = async (userId: number) => {
  const response = await fetch(`${API_BASE}/api/users/${userId}/promote`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      // Falls wir später einen Auth-Header für Admin-Rechte brauchen:
      // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Beförderung fehlgeschlagen');
  }

  return await response.json();
};