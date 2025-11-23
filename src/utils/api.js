// Centralized API utility for koodiapina.net

const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://koodiapina-net.leinonen-op.workers.dev';

// Simple hash function for PIN codes
async function hashPin(pin) {
  if (!pin) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function fetchRecipes(page = 1, limit = 20, searchQuery = '', profileGuid = null) {
  let url = `${API_BASE_URL}?page=${page}&limit=${limit}`;
  if (searchQuery && searchQuery.trim()) {
    url += `&search=${encodeURIComponent(searchQuery.trim())}`;
  }
  if (profileGuid) {
    url += `&profile_guid=${encodeURIComponent(profileGuid)}`;
  }
  const res = await fetch(url);
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

export async function fetchHidden(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/hidden/${profileGuid}`);
  if (!res.ok) throw new Error('Failed to fetch hidden recipes');
  return await res.json();
}

export async function addHidden(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/hidden`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile_guid: profileGuid, recipe_guid: recipeGuid }),
  });
  if (!res.ok) throw new Error('Failed to hide recipe');
  return await res.json();
}

export async function removeHidden(profileGuid, recipeGuid) {
  const res = await fetch(`${API_BASE_URL}/hidden/${profileGuid}/${recipeGuid}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to unhide recipe');
  return await res.json();
}

export async function createProfile(username, displayName, email, isAdmin, pin) {
  const passwordHash = await hashPin(pin);
  
  const res = await fetch(`${API_BASE_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      username, 
      display_name: displayName, 
      email: email || null,
      is_admin: isAdmin,
      password_hash: passwordHash
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create profile');
  }
  return await res.json();
}

export async function updateProfile(profileGuid, username, displayName, email, isAdmin, pin) {
  const passwordHash = await hashPin(pin);
  
  const res = await fetch(`${API_BASE_URL}/profiles/${profileGuid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      username, 
      display_name: displayName, 
      email: email || null,
      is_admin: isAdmin,
      password_hash: passwordHash
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  return await res.json();
}

export async function deleteProfile(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/profiles/${profileGuid}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete profile');
  }
  return await res.json();
}

export async function verifyPin(profileGuid, pin) {
  const passwordHash = await hashPin(pin);
  
  const res = await fetch(`${API_BASE_URL}/profiles/${profileGuid}/verify-pin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password_hash: passwordHash }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to verify PIN');
  }
  return await res.json();
}

export async function reactivateProfile(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/profiles/${profileGuid}/reactivate`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to reactivate profile');
  }
  return await res.json();
}

export async function permanentDeleteProfile(profileGuid) {
  const res = await fetch(`${API_BASE_URL}/profiles/${profileGuid}/permanent`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to permanently delete profile');
  }
  return await res.json();
}

// Add more API functions here as needed
