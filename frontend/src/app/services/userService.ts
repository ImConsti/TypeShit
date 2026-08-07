const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const promoteUser = async (userId: number) => {
  const token = sessionStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/users/${userId}/promote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Beförderung fehlgeschlagen');
  }
  return await response.json();
};

export const fetchUsers = async () => {
  const token = sessionStorage.getItem('auth_token');
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

export const demoteUser = async (userId: number) => {
  const token = sessionStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/users/${userId}/demote`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Degradierung fehlgeschlagen');
  }
  return await response.json();
};

export const deleteUser = async (userId: number) => {
  const token = sessionStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Löschen fehlgeschlagen');
  }
  return await response.json();
};