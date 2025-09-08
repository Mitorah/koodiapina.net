// Cloudflare Worker: Paginated Recipes API
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100); // max 100 per page
    const offset = (page - 1) * limit;

    // Optional: add filtering by title, diet, allergens, etc.
    // const title = url.searchParams.get('title');

    const origin = request.headers.get('Origin');
    // Detect local development by checking for localhost in the request URL
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    let allowedOrigin = '';
    if (isLocal) {
      allowedOrigin = '*';
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
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Restrict access to allowed origins (except local dev)
    if (!isLocal && origin && !allowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

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
