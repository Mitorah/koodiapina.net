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

### First-Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create local database:**
   ```bash
   npx wrangler d1 create koodiapina_local
   ```
   This will output a database ID. Update `wrangler.toml` with the new ID.

3. **Run all migrations:**
   ```bash
   # Run migrations on local database
   for migration in migrations/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --file "$migration"
   done
   ```

4. **Create a test profile:**
   ```bash
   npx wrangler d1 execute koodiapina_local --env local --command \
     "INSERT INTO profiles (username, display_name, email, is_admin) VALUES ('testuser', 'Test User', 'test@example.com', 1);"
   ```

### Daily Development

1. **Start the API worker (Terminal 1):**
   ```bash
   npx wrangler dev --env local
   ```
   This starts the API at `http://localhost:8787`

2. **Start the frontend dev server (Terminal 2):**
   ```bash
   npm run dev
   ```
   This starts the Vue app at `http://localhost:5173`

The frontend automatically connects to the local API worker.

### Resetting Local Database

If you need to start fresh:

```bash
# Delete and recreate
npx wrangler d1 delete koodiapina_local
npx wrangler d1 create koodiapina_local

# Update wrangler.toml with the new database ID

# Run all migrations
for migration in migrations/*.sql; do 
  npx wrangler d1 execute koodiapina_local --env local --file "$migration"
done
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment documentation including:
- Automatic deployment via GitHub Actions
- Manual deployment procedures  
- Database migrations
- Troubleshooting

## Development

### Project Structure

```
koodiapina.net/
├── src/                    # Vue frontend source
│   ├── components/        # Vue components
│   ├── views/            # Page views
│   ├── utils/            # Utilities (API client, units parser)
│   └── styles/           # CSS files
├── workers/              # Cloudflare Workers
│   └── recipes_api/      # Main API worker
├── migrations/           # Database migrations
├── public/              # Static assets
└── dist/                # Build output (generated)
```

### API Endpoints

The API worker (`workers/recipes_api/worker.js`) provides:

- **Recipes:**
  - `GET /` - List recipes (paginated)
  - `GET /{recipe_guid}` - Get single recipe

- **Profiles:**
  - `GET /profiles` - List all profiles
  - `POST /profiles` - Create new profile (admin only)

- **Favorites:**
  - `GET /favorites/{profile_guid}` - Get user's favorites
  - `POST /favorites` - Add to favorites
  - `DELETE /favorites/{profile_guid}/{recipe_guid}` - Remove from favorites

- **Shopping List:**
  - `GET /shopping-list/{profile_guid}` - Get shopping list
  - `POST /shopping-list` - Add to shopping list
  - `DELETE /shopping-list/{profile_guid}/{recipe_guid}` - Remove from shopping list

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