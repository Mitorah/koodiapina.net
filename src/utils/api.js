// Centralized API utility for koodiapina.net

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://worker-recipes-api.leinonen-op.workers.dev';

export async function fetchRecipes(page = 1, limit = 20) {
  const res = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return await res.json();
}

// Add more API functions here as needed
