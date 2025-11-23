// Cloudflare Worker: Paginated Recipes API with Profiles
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Optional: add filtering by title, diet, allergens, etc.
    // const title = url.searchParams.get('title');

    const origin = request.headers.get('Origin');
    // Detect local development by checking for localhost in the origin
    const isLocal = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
    
    let allowedOrigin = '';
    if (isLocal || (origin && origin === env.ALLOWED_ORIGIN)) {
      allowedOrigin = origin;
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Restrict access to allowed origins (except local dev)
    if (!isLocal && origin && !allowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

    // Handle /auth/user endpoint - returns Cloudflare Access authenticated user email
    if (pathname === '/auth/user' && request.method === 'GET') {
      // Get email from Cloudflare Access header
      const userEmail = request.headers.get('CF-Access-Authenticated-User-Email') || null;
      
      return new Response(JSON.stringify({
        email: userEmail
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        }
      });
    }

    // Handle /profiles endpoint
    if (pathname === '/profiles' && request.method === 'GET') {
      const profilesRes = await env.DB.prepare(
        'SELECT profile_guid, username, display_name, email, is_admin, is_active FROM profiles ORDER BY username'
      ).all();
      
      return new Response(JSON.stringify({
        profiles: profilesRes.results || []
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        }
      });
    }

    // Handle /profiles/:profile_guid endpoint - DELETE to soft-delete a profile (admin only)
    // Must be before verify-pin to avoid path conflicts
    if (pathname.match(/^\/profiles\/[^\/]+$/) && request.method === 'DELETE') {
      const profileGuid = pathname.split('/')[2];

      try {
        // Soft delete: set is_active = 0 instead of actually deleting
        await env.DB.prepare(
          'UPDATE profiles SET is_active = 0 WHERE profile_guid = ?'
        ).bind(profileGuid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          profile_guid: profileGuid
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /profiles/:profile_guid/reactivate endpoint - POST to reactivate a profile (admin only)
    if (pathname.match(/^\/profiles\/[^\/]+\/reactivate$/) && request.method === 'POST') {
      const profileGuid = pathname.split('/')[2];

      try {
        // Reactivate: set is_active = 1
        await env.DB.prepare(
          'UPDATE profiles SET is_active = 1 WHERE profile_guid = ?'
        ).bind(profileGuid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          profile_guid: profileGuid
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /profiles/:profile_guid/permanent endpoint - DELETE to permanently delete a profile (admin only)
    if (pathname.match(/^\/profiles\/[^\/]+\/permanent$/) && request.method === 'DELETE') {
      const profileGuid = pathname.split('/')[2];

      try {
        // Hard delete: actually remove the row from database
        await env.DB.prepare(
          'DELETE FROM profiles WHERE profile_guid = ?'
        ).bind(profileGuid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          profile_guid: profileGuid
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /profiles/:profile_guid/verify-pin endpoint - POST to verify PIN
    if (pathname.match(/^\/profiles\/[^\/]+\/verify-pin$/) && request.method === 'POST') {
      const profileGuid = pathname.split('/')[2];
      const body = await request.json();
      const { password_hash } = body;
      
      try {
        const profile = await env.DB.prepare(
          'SELECT password_hash FROM profiles WHERE profile_guid = ?'
        ).bind(profileGuid).first();
        
        if (!profile) {
          return new Response(JSON.stringify({ error: 'Profile not found' }), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': allowedOrigin,
            }
          });
        }
        
        // If profile has no PIN set, allow access
        if (!profile.password_hash) {
          return new Response(JSON.stringify({ valid: true }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': allowedOrigin,
            }
          });
        }
        
        // Compare provided hash with stored hash
        const valid = password_hash === profile.password_hash;
        
        return new Response(JSON.stringify({ valid }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /profiles endpoint - POST to create a new profile (admin only)
    if (pathname === '/profiles' && request.method === 'POST') {
      const body = await request.json();
      const { username, display_name, email, is_admin, password_hash } = body;
      
      if (!username || !display_name) {
        return new Response(JSON.stringify({ error: 'username and display_name are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        // Check if username already exists
        const existing = await env.DB.prepare(
          'SELECT profile_guid FROM profiles WHERE username = ?'
        ).bind(username).first();
        
        if (existing) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
            status: 409,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': allowedOrigin,
            }
          });
        }

        // Generate a GUID for the profile using randomblob
        const guidResult = await env.DB.prepare(
          'SELECT lower(hex(randomblob(16))) as guid'
        ).first();
        
        const profileGuid = guidResult.guid;
        
        await env.DB.prepare(
          'INSERT INTO profiles (profile_guid, username, display_name, email, is_admin, is_active, password_hash) VALUES (?, ?, ?, ?, ?, 1, ?)'
        ).bind(profileGuid, username, display_name, email || null, is_admin ? 1 : 0, password_hash || null).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          profile_guid: profileGuid,
          username,
          display_name
        }), {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /profiles/:profile_guid endpoint - PUT to update a profile (admin only)
    if (pathname.startsWith('/profiles/') && request.method === 'PUT') {
      const profileGuid = pathname.split('/')[2];
      const body = await request.json();
      const { username, display_name, email, is_admin, password_hash } = body;
      
      if (!username || !display_name) {
        return new Response(JSON.stringify({ error: 'username and display_name are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        // Check if username already exists for a different profile
        const existing = await env.DB.prepare(
          'SELECT profile_guid FROM profiles WHERE username = ? AND profile_guid != ?'
        ).bind(username, profileGuid).first();
        
        if (existing) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
            status: 409,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': allowedOrigin,
            }
          });
        }

        // Update profile - only update password_hash if provided
        if (password_hash) {
          await env.DB.prepare(
            'UPDATE profiles SET username = ?, display_name = ?, email = ?, is_admin = ?, password_hash = ? WHERE profile_guid = ?'
          ).bind(username, display_name, email || null, is_admin ? 1 : 0, password_hash, profileGuid).run();
        } else {
          await env.DB.prepare(
            'UPDATE profiles SET username = ?, display_name = ?, email = ?, is_admin = ? WHERE profile_guid = ?'
          ).bind(username, display_name, email || null, is_admin ? 1 : 0, profileGuid).run();
        }
        
        return new Response(JSON.stringify({ 
          success: true,
          profile_guid: profileGuid,
          username,
          display_name
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /favorites/:profile_guid endpoint - GET favorites for a user
    if (pathname.startsWith('/favorites/') && request.method === 'GET') {
      const profileGuid = pathname.split('/')[2];
      const favoritesRes = await env.DB.prepare(
        'SELECT f.favorite_id, f.recipe_guid, f.added_at FROM favorites f WHERE f.profile_guid = ? ORDER BY f.added_at DESC'
      ).bind(profileGuid).all();
      
      return new Response(JSON.stringify({
        favorites: favoritesRes.results || []
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        }
      });
    }

    // Handle /favorites endpoint - POST to add a favorite
    if (pathname === '/favorites' && request.method === 'POST') {
      const body = await request.json();
      const { profile_guid, recipe_guid } = body;
      
      if (!profile_guid || !recipe_guid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        // Generate a GUID for the favorite
        const favoriteId = crypto.randomUUID();
        
        await env.DB.prepare(
          'INSERT INTO favorites (favorite_id, profile_guid, recipe_guid) VALUES (?, ?, ?)'
        ).bind(favoriteId, profile_guid, recipe_guid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          favorite_id: favoriteId
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to add favorite',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /favorites/:profile_guid/:recipe_guid endpoint - DELETE to remove a favorite
    if (pathname.startsWith('/favorites/') && request.method === 'DELETE') {
      const parts = pathname.split('/');
      const profileGuid = parts[2];
      const recipeGuid = parts[3];
      
      if (!profileGuid || !recipeGuid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        await env.DB.prepare(
          'DELETE FROM favorites WHERE profile_guid = ? AND recipe_guid = ?'
        ).bind(profileGuid, recipeGuid).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to remove favorite',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /hidden/:profile_guid endpoint - GET hidden recipes for a user
    if (pathname.startsWith('/hidden/') && request.method === 'GET') {
      const profileGuid = pathname.split('/')[2];
      const hiddenRes = await env.DB.prepare(
        'SELECT h.hidden_id, h.recipe_guid, h.hidden_at FROM hidden_recipes h WHERE h.profile_guid = ? ORDER BY h.hidden_at DESC'
      ).bind(profileGuid).all();
      
      return new Response(JSON.stringify({
        hidden: hiddenRes.results || []
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        }
      });
    }

    // Handle /hidden endpoint - POST to hide a recipe
    if (pathname === '/hidden' && request.method === 'POST') {
      const body = await request.json();
      const { profile_guid, recipe_guid } = body;
      
      if (!profile_guid || !recipe_guid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        // Generate a GUID for the hidden entry
        const hiddenId = crypto.randomUUID();
        
        await env.DB.prepare(
          'INSERT INTO hidden_recipes (hidden_id, profile_guid, recipe_guid) VALUES (?, ?, ?)'
        ).bind(hiddenId, profile_guid, recipe_guid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          hidden_id: hiddenId
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to hide recipe',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /hidden/:profile_guid/:recipe_guid endpoint - DELETE to unhide a recipe
    if (pathname.startsWith('/hidden/') && request.method === 'DELETE') {
      const parts = pathname.split('/');
      const profileGuid = parts[2];
      const recipeGuid = parts[3];
      
      if (!profileGuid || !recipeGuid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        await env.DB.prepare(
          'DELETE FROM hidden_recipes WHERE profile_guid = ? AND recipe_guid = ?'
        ).bind(profileGuid, recipeGuid).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to unhide recipe',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /shopping-list/:profile_guid endpoint - GET shopping list for a user
    if (pathname.startsWith('/shopping-list/') && request.method === 'GET') {
      const profileGuid = pathname.split('/')[2];
      const shoppingListRes = await env.DB.prepare(
        'SELECT s.shopping_list_id, s.recipe_guid, s.added_at FROM shopping_list s WHERE s.profile_guid = ? ORDER BY s.added_at DESC'
      ).bind(profileGuid).all();
      
      return new Response(JSON.stringify({
        shopping_list: shoppingListRes.results || []
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': allowedOrigin,
        }
      });
    }

    // Handle /shopping-list endpoint - POST to add a recipe to shopping list
    if (pathname === '/shopping-list' && request.method === 'POST') {
      const body = await request.json();
      const { profile_guid, recipe_guid } = body;
      
      if (!profile_guid || !recipe_guid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        const shoppingListId = crypto.randomUUID();
        
        await env.DB.prepare(
          'INSERT INTO shopping_list (shopping_list_id, profile_guid, recipe_guid) VALUES (?, ?, ?)'
        ).bind(shoppingListId, profile_guid, recipe_guid).run();
        
        return new Response(JSON.stringify({ 
          success: true,
          shopping_list_id: shoppingListId
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to add to shopping list',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /shopping-list/:profile_guid/:recipe_guid endpoint - DELETE to remove from shopping list
    if (pathname.startsWith('/shopping-list/') && request.method === 'DELETE') {
      const parts = pathname.split('/');
      const profileGuid = parts[2];
      const recipeGuid = parts[3];
      
      if (!profileGuid || !recipeGuid) {
        return new Response(JSON.stringify({ error: 'profile_guid and recipe_guid are required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }

      try {
        await env.DB.prepare(
          'DELETE FROM shopping_list WHERE profile_guid = ? AND recipe_guid = ?'
        ).bind(profileGuid, recipeGuid).run();
        
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to remove from shopping list',
          message: error.message 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': allowedOrigin,
          }
        });
      }
    }

    // Handle /recipes endpoint (default)
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100); // max 100 per page
    const searchQuery = url.searchParams.get('search') || url.searchParams.get('q');
    const profileGuid = url.searchParams.get('profile_guid');

    // Build WHERE clause for search and hidden recipes filter
    let whereClause = 'WHERE instructions IS NOT NULL';
    let searchParams = [];
    
    // Filter out hidden recipes if profile_guid is provided
    if (profileGuid) {
      whereClause += ' AND recipe_guid NOT IN (SELECT recipe_guid FROM hidden_recipes WHERE profile_guid = ?)';
      searchParams.push(profileGuid);
    }
    
    if (searchQuery && searchQuery.trim()) {
      // Sanitize and stem the search query
      const sanitized = sanitizeSearchInput(searchQuery.trim());
      if (sanitized) {
        const stemmedSearch = stemFinnish(sanitized.toLowerCase());
        whereClause += ' AND search_text IS NOT NULL AND LOWER(search_text) LIKE ?';
        searchParams.push(`%${escapeLikePattern(stemmedSearch)}%`);
      }
    }

    // Count total recipes (with search filter and hidden filter if present)
    const countQuery = `SELECT COUNT(*) as count FROM recipes ${whereClause}`;
    const totalRes = searchParams.length > 0 
      ? await env.DB.prepare(countQuery).bind(...searchParams).first()
      : await env.DB.prepare(countQuery).first();
    const total = totalRes?.count || 0;

    // Calculate offset based on page and limit (applied after filtering)
    const offset = (page - 1) * limit;

    // Fetch paginated recipes (with search filter and hidden filter if present)
    const recipesQuery = `SELECT recipe_guid, title, added_date, details, instructions FROM recipes ${whereClause} ORDER BY added_date DESC LIMIT ? OFFSET ?`;
    const recipesRes = searchParams.length > 0
      ? await env.DB.prepare(recipesQuery).bind(...searchParams, limit, offset).all()
      : await env.DB.prepare(recipesQuery).bind(limit, offset).all();

    // Format response
    // Parse details and instructions fields if they are strings
    const recipes = (recipesRes.results || []).map(r => {
      let details = r.details;
      let instructions = r.instructions;
      try {
        if (typeof details === 'string') details = JSON.parse(details);
      } catch (e) {
        // leave as string if parsing fails
      }
      try {
        if (typeof instructions === 'string') instructions = JSON.parse(instructions);
      } catch (e) {
        // leave as string if parsing fails
      }
      return { ...r, details, instructions };
    });
    return new Response(JSON.stringify({
      page,
      limit,
      total,
      recipes
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allowedOrigin,
      }
    });
  }
}

/**
 * Sanitize search input to prevent malicious queries
 * @param {string} input - User search input
 * @returns {string} - Sanitized input
 */
function sanitizeSearchInput(input) {
  if (!input) return '';
  
  // Remove any characters that aren't letters, spaces, or Finnish characters
  // Allow only: a-z, å, ä, ö, and spaces
  return input.replace(/[^a-zåäö\s]/gi, '').trim();
}

/**
 * Escape special LIKE pattern characters to prevent LIKE injection
 * @param {string} pattern - Pattern to escape
 * @returns {string} - Escaped pattern
 */
function escapeLikePattern(pattern) {
  if (!pattern) return '';
  
  // Escape LIKE special characters: % _ [ ]
  return pattern
    .replace(/\\/g, '\\\\')  // Escape backslash first
    .replace(/%/g, '\\%')    // Escape %
    .replace(/_/g, '\\_')    // Escape _
    .replace(/\[/g, '\\[')   // Escape [
    .replace(/\]/g, '\\]');  // Escape ]
}

/**
 * Simple Finnish stemmer - removes common suffixes
 * This matches the stemmer used in the search population worker
 * @param {string} word - Finnish word to stem
 * @returns {string} - Stemmed word
 */
function stemFinnish(word) {
  if (!word || word.length < 3) return word;

  // Store original for fallback
  const original = word;

  // Remove possessive suffixes (must be done first)
  word = word.replace(/(ni|si|nsa|mme|nne|nsa)$/, '');

  // Remove case endings (genetive, partitive, etc.)
  word = word
    // Partitive plural
    .replace(/(oita|öitä|eita|ita|itä)$/, '')
    // Partitive singular  
    .replace(/(aa|ää|ta|tä)$/, '')
    // Illative
    .replace(/(seen|siin|hun|hyn|hön)$/, '')
    // Inessive/Elative/Adessive/Ablative/Allative
    .replace(/(ssa|ssä|sta|stä|lla|llä|lta|ltä|lle)$/, '')
    // Plural marker
    .replace(/(jen|en|in|ien|ten|den|tten)$/, '');

  // Don't return too-short stems (avoid over-stemming)
  if (word.length < 3) {
    return original;
  }

  return word;
}
