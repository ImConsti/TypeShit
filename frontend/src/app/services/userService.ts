const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const promoteUser = async (userId: number) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/users/${userId}/promote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Befoerderung fehlgeschlagen');
  }
  return await response.json();
};

export const fetchUsers = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Fehler beim Laden der Nutzer');
  }

  return await response.json();
};