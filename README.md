# koodiapina-net

A modern Vue + Cloudflare D1 app for browsing, syncing, and displaying recipes from ruokaboksi.fi.

## Tech Stack

- **Frontend**: Vue 3, Element Plus, Vite
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages, GitHub Actions
- **Development**: Wrangler, Miniflare

## Features
- Automated recipe and instruction sync from ruokaboksi.fi
- Cloudflare D1 database for recipes and logs
- Paginated API for frontend
- Vue frontend with grouped, styled ingredient display
- Finnish localization for UI
- Local development with Miniflare/Wrangler

## API Overview

REST API for recipes, profiles, favorites, and shopping lists:
- **Recipes**: List (paginated) and retrieve individual recipes
- **Profiles**: User profile management (admin-only creation)
- **Favorites**: Add/remove/list favorite recipes per profile
- **Shopping List**: Add/remove/list shopping items per profile

See [API.md](./API.md) for complete API documentation.

## Setup

### First-Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your domain:**
   Edit `wrangler.toml` and update the `ALLOWED_ORIGIN` variable to your frontend URL:
   ```toml
   [vars]
   ALLOWED_ORIGIN = "https://your-domain.com"
   ```

3. **Create local database:**
   ```bash
   npx wrangler d1 create koodiapina_local
   ```
   Copy the database ID from the output and update it in `wrangler.toml` under `[[env.local.d1_databases]]`.

4. **Run all migrations:**
   ```bash
   # Run migrations on local database
   for migration in migrations/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --file "$migration"
   done
   ```
   
   This will create all tables, seed recipes, and create test profiles (including an admin user).

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

1. Delete and recreate the database:
   ```bash
   npx wrangler d1 delete koodiapina_local
   npx wrangler d1 create koodiapina_local
   ```

2. Update `wrangler.toml` with the new database ID under `[[env.local.d1_databases]]`.

3. Run all migrations:
   ```bash
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

### Code Structure
- Frontend: Vue 3, Element Plus, global styles in `src/styles/styles.css`
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