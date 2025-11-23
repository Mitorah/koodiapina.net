// Cloudflare Worker to fetch recipes daily using Wrangler secrets
// This template uses D1 for storage, but can be adapted for KV

export default {
  async fetch(request, env, ctx) {
    try {
      const email = env.API_EMAIL;
      const password = env.API_PASSWORD;
      const apiKey = env.API_KEY;

      // Step 1: Get bearer token
      const tokenRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );
      if (!tokenRes.ok) return new Response('Auth failed', { status: 401 });
      const tokenData = await tokenRes.json();
      const bearer = tokenData.idToken;

      // Step 2: Fetch recipe list (example endpoint)
      const recipesRes = await fetch('https://api.ruokaboksi.fi/api/recipes/FIN?country=FI&language=fi', {
        headers: { 'Authorization': `Bearer ${bearer}` }
      });
      const debugText = await recipesRes.text();
      if (!recipesRes.ok) return new Response(`Recipe fetch failed. Status: ${recipesRes.status}. Response: ${debugText}`, { status: 500 });
      let recipes;
      try {
        recipes = JSON.parse(debugText);
        // Try to extract array if recipes is not an array
        if (!Array.isArray(recipes)) {
          if (Array.isArray(recipes.items)) {
            recipes = recipes.items;
          } else if (Array.isArray(recipes.data)) {
            recipes = recipes.data;
          } else {
            return new Response('No recipe array found in API response', { status: 500 });
          }
        }
      } catch (err) {
        console.error('Failed to parse recipes JSON:', err);
        return new Response('Invalid recipes JSON', { status: 500 });
      }

      // Step 3: Deduplicate by title
      const seen = new Set();
      const uniqueRecipes = recipes.filter(r => {
        if (seen.has(r.title)) return false;
        seen.add(r.title);
        return true;
      });

      // Step 4: Fetch full JSON for each recipe and store in D1
      let storedCount = 0;
      for (const recipe of uniqueRecipes) {
        const instructionsUrl = `https://api.ruokaboksi.fi/api/recipes/FIN/${recipe.recipe_guid}/instructions?country=FI&language=fi`;
        const detailRes = await fetch(instructionsUrl, {
          headers: { 'Authorization': `Bearer ${bearer}` }
        });
        if (!detailRes.ok) continue;
        // Optionally, you can store instructionsJson as a string in a new column if you add it to the table
        await env.DB.prepare(
          'INSERT OR IGNORE INTO recipes (recipe_guid, title, instructions) VALUES (?, ?, ?)' // now includes instructions
        ).bind(recipe.recipe_guid, recipe.title, JSON.stringify(instructionsJson)).run();
        storedCount++;
      }

      return new Response(`Stored ${storedCount} unique recipes with full JSON`, { status: 200 });
    } catch (err) {
      console.error('Worker exception:', err);
      return new Response('Worker exception: ' + err.message, { status: 500 });
    }
  }
}
