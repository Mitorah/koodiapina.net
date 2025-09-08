// Cloudflare Worker: Paginated Recipes API
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 100); // max 100 per page
    const offset = (page - 1) * limit;

    // Optional: add filtering by title, diet, allergens, etc.
    // const title = url.searchParams.get('title');

    const allowedOrigins = [
      'https://koodiapina-net.pages.dev',
      'https://www.koodiapina.net'
    ];
    const origin = request.headers.get('Origin');
    const corsOrigin = allowedOrigins.includes(origin) ? origin : '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Restrict access to allowed origins
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // Count total recipes
    const totalRes = await env.DB.prepare('SELECT COUNT(*) as count FROM recipes').first();
    const total = totalRes?.count || 0;

    // Fetch paginated recipes
    const recipesRes = await env.DB.prepare(
      'SELECT recipe_guid, title, added_date, details FROM recipes ORDER BY added_date DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();

    // Format response
    return new Response(JSON.stringify({
      page,
      limit,
      total,
      recipes: recipesRes.results || []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin,
      }
    });
  }
}
