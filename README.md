# koodiapina-net

A modern Vue + Cloudflare D1 app for browsing, syncing, and displaying recipes from ruokaboksi.fi.

## Features
- Automated recipe and instruction sync from ruokaboksi.fi
- Cloudflare D1 database for recipes and logs
- Paginated API for frontend
- Vue frontend with grouped, styled ingredient display
- Finnish localization for UI
- Local development with Miniflare/Wrangler

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure Cloudflare Wrangler and D1:
   - Install Wrangler globally if needed:
     ```bash
     npm install -g wrangler
     ```
   - Edit `wrangler.toml`:
     - Set your D1 database binding name (e.g. `koodiapina_local`)
     - Add your Cloudflare account ID and database ID
     - Example:
       ```toml
       [d1_databases]
       binding = "koodiapina_local"
       database_id = "your-database-id"
       database_name = "koodiapina_local"
       ```
   - Set up environment variables/secrets if needed:
     ```bash
     npx wrangler secret put API_KEY
     ```
   - Apply migrations in order:
     ```bash
     npx wrangler d1 execute koodiapina_local --file migrations/0001_create_recipes.sql
     npx wrangler d1 execute koodiapina_local --file migrations/0002_create_fetch_log.sql
     npx wrangler d1 execute koodiapina_local --file migrations/0003_seed_real_recipes.sql
     ```
   - If you see a UNIQUE constraint error, clear the table first:
     ```bash
     npx wrangler d1 execute koodiapina_local --command "DELETE FROM recipes;"
     ```
   - For remote D1, add `--remote` to commands.
3. Start local dev server:
   ```bash
   npm run dev
   ```

## Development

### Local Development Options

#### Frontend Development (npm run dev)
For frontend-only development:
```bash
npm run dev
```
This starts the Vite development server for the Vue frontend.

#### Full Stack Development (npx wrangler dev)
For testing with Cloudflare Workers and D1 database integration:
```bash
npx wrangler dev
```
This command:
- Starts the Wrangler development server with Miniflare
- Provides access to local D1 database bindings
- Enables testing of Cloudflare Workers functionality
- Useful when working on API endpoints, database operations, or worker scripts
- Serves the application at `http://localhost:8787` by default

Use `npx wrangler dev` when you need to:
- Test recipe syncing functionality
- Debug database operations
- Work on the Cloudflare Workers API endpoints
- Test the full application stack locally

### Code Structure
- Frontend: Vue 3, Element UI, global styles in `src/styles/styles.css`
- Backend: Cloudflare Workers for sync and API
- All recipe data is grouped and localized in Finnish
- To update styles, edit `src/styles/styles.css`

## Usage
- Browse recipes with grouped ingredients, pantry items, and steps
- Click recipe headers to expand/collapse details
- Only one recipe card is open at a time

## Contributing
Pull requests and issues welcome!

## License
MIT