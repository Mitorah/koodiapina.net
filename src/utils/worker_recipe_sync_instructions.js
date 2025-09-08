// Worker B: Minute-by-minute instructions sync
export default {
  async fetch(request, env, ctx) {
    try {
      // Find one recipe missing instructions
      const row = await env.DB.prepare(
        'SELECT recipe_guid, title FROM recipes WHERE instructions IS NULL LIMIT 1'
      ).first();
      if (!row) return new Response('No recipes need instructions', { status: 200 });
      // Authenticate
      const email = env.API_EMAIL;
      const password = env.API_PASSWORD;
      const apiKey = env.API_KEY;
      const tokenRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      );
      if (!tokenRes.ok) return new Response('Auth failed', { status: 401 });
      const tokenData = await tokenRes.json();
      const bearer = tokenData.idToken;
      // Fetch instructions JSON
      const instructionsUrl = `https://api.ruokaboksi.fi/api/recipes/FIN/${row.recipe_guid}/instructions?country=FI&language=fi`;
      const detailRes = await fetch(instructionsUrl, {
        headers: { 'Authorization': `Bearer ${bearer}` }
      });
      if (!detailRes.ok) return new Response('Instructions fetch failed', { status: 500 });
      const instructionsJson = await detailRes.json();
      // Update row
      await env.DB.prepare(
        'UPDATE recipes SET instructions = ? WHERE recipe_guid = ?'
      ).bind(JSON.stringify(instructionsJson), row.recipe_guid).run();
      return new Response(`Updated instructions for ${row.title}`, { status: 200 });
    } catch (err) {
      return new Response('Worker exception: ' + err.message, { status: 500 });
    }
  }
}
