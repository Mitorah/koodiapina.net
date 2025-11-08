// Centralized API utility for koodiapina.net

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://worker-recipes-api.leinonen-op.workers.dev';

export async function fetchRecipes(page = 1, limit = 20) {
  const res = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return await res.json();
}

export async function fetchProfiles() {
  const res = await fetch(`${API_BASE_URL}/profiles`);
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return await res.json();
}

export async function fetchFavorites(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/favorites/${profileGuid}`);
  if (!res.ok) throw new Error('Failed to fetch favorites');
  return await res.json();
}

export async function addFavorite(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_guid: profileGuid, recipe_guid: recipeGuid }),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return await res.json();
}

export async function removeFavorite(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/favorites/${profileGuid}/${recipeGuid}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return await res.json();
}

export async function fetchShoppingList(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/shopping-list/${profileGuid}`);
  if (!res.ok) throw new Error('Failed to fetch shopping list');
  return await res.json();
}

export async function addToShoppingList(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/shopping-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_guid: profileGuid, recipe_guid: recipeGuid }),
  });
  if (!res.ok) throw new Error('Failed to add to shopping list');
  return await res.json();
}

export async function removeFromShoppingList(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/shopping-list/${profileGuid}/${recipeGuid}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove from shopping list');
  return await res.json();
}

export async function createProfile(username, displayName, email, isAdmin) {
  const res = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      username, 
      display_name: displayName, 
      email: email || null,
      is_admin: isAdmin 
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create profile');
  }
  return await res.json();
}

// Add more API functions here as needed
