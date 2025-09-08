// Worker A: Daily sync of recipe IDs and titles
export default {
  async fetch(request, env, ctx) {
    try {
      const email = env.API_EMAIL;
      const password = env.API_PASSWORD;
      const apiKey = env.API_KEY;
      // Authenticate
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
      // Fetch recipe list
      const recipesRes = await fetch('https://api.ruokaboksi.fi/api/recipes/FIN?country=FI&language=fi', {
        headers: { 'Authorization': `Bearer ${bearer}` }
      });
      const debugText = await recipesRes.text();
      if (!recipesRes.ok) return new Response(`Recipe fetch failed. Status: ${recipesRes.status}. Response: ${debugText}`, { status: 500 });
      let recipes;
      try {
        recipes = JSON.parse(debugText);
        if (!Array.isArray(recipes)) {
          if (Array.isArray(recipes.items)) recipes = recipes.items;
          else if (Array.isArray(recipes.data)) recipes = recipes.data;
          else return new Response('No recipe array found in API response', { status: 500 });
        }
      } catch (err) {
        return new Response('Invalid recipes JSON', { status: 500 });
      }
      // Insert new recipes
      let inserted = 0;
      for (const recipe of recipes) {
        const result = await env.DB.prepare(
          'INSERT OR IGNORE INTO recipes (recipe_guid, title) VALUES (?, ?)' 
        ).bind(recipe.recipe_guid, recipe.title).run();
        if (result.success) inserted++;
      }
      return new Response(`Inserted ${inserted} new recipes`, { status: 200 });
    } catch (err) {
      return new Response('Worker exception: ' + err.message, { status: 500 });
    }
  }
}
