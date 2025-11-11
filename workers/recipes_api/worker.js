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
    if (isLocal) {
      allowedOrigin = origin; // Allow the specific localhost origin
    } else if (
      origin && (
        /^https?:\/\/[a-z0-9-]+\.koodiapina-net\.pages\.dev$/.test(origin) ||
        origin === 'https://www.koodiapina.net'
      )
    ) {
      allowedOrigin = origin;
    }

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Restrict access to allowed origins (except local dev)
    if (!isLocal && origin && !allowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

    // Handle /profiles endpoint
    if (pathname === '/profiles' && request.method === 'GET') {
      const profilesRes = await env.DB.prepare(
        'SELECT profile_guid, username, display_name, email, is_admin FROM profiles WHERE is_active = 1 ORDER BY username'
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

    // Handle /profiles endpoint - POST to create a new profile (admin only)
    if (pathname === '/profiles' && request.method === 'POST') {
      const body = await request.json();
      const { username, display_name, email, is_admin } = body;
      
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
          'INSERT INTO profiles (profile_guid, username, display_name, email, is_admin, is_active) VALUES (?, ?, ?, ?, ?, 1)'
        ).bind(profileGuid, username, display_name, email || null, is_admin ? 1 : 0).run();
        
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
    const offset = (page - 1) * limit;

    // Count total recipes
    const totalRes = await env.DB.prepare('SELECT COUNT(*) as count FROM recipes').first();
    const total = totalRes?.count || 0;

    // Fetch paginated recipes
    const recipesRes = await env.DB.prepare(
      'SELECT recipe_guid, title, added_date, details, instructions FROM recipes WHERE instructions IS NOT NULL ORDER BY added_date DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();

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
