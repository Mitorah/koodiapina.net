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

## Security

### Authentication & Authorization

This application uses **Cloudflare Access** for authentication:

- **Infrastructure-level protection**: All API endpoints are protected by Cloudflare Access
- **No password management**: Uses your existing identity provider (Google, GitHub, etc.)
- **Automatic authentication**: Access injects `CF-Access-Authenticated-User-Email` header
- **Admin operations**: Profile creation/deletion/modification requires admin status

### Profile System

- **Profiles are for family members**: Mom, Dad, Kids, etc.
- **PIN codes for profile switching**: Simple 4-digit codes prevent accidental switching
- **Not for authentication**: Cloudflare Access handles real authentication
- **Each profile has**: Individual favorites, shopping lists, and hidden recipes

### Setting Up Cloudflare Access

**Required for production deployment:**

1. Go to **Cloudflare Zero Trust** → **Access** → **Applications**
2. Create a new Self-hosted application:
   - **Application name**: Koodiapina.net
   - **Session duration**: 24 hours (or your preference)
   - **Add public hostnames**:
     - `ruoka.koodiapina.net` (frontend)
     - `koodiapina-net.leinonen-op.workers.dev` (API worker)

3. **Add Access Policy**:
   - **Policy name**: Allow family members
   - **Action**: Allow
   - **Include**: Emails (add your family members' emails)

4. **Configure Identity Provider** (if not already done):
   - Go to **Access** → **Authentication** → **Login methods**
   - Add: Google, GitHub, Microsoft, or One-time PIN

5. **Test**: Access your app in incognito mode - you should be prompted to authenticate

### Security Best Practices

- ✅ **API protected by CF Access** - Only authenticated users can access
- ✅ **CORS properly configured** - Only allows requests from authorized domains
- ✅ **Credentials required** - All API calls include authentication cookies
- ✅ **SQL injection prevented** - Using prepared statements with parameter binding
- ✅ **Admin operations protected** - Only users with `is_admin = 1` can create/delete profiles
- ✅ **Environment variables** - Secrets managed through Cloudflare dashboard, not in code

### Local Development Security

- **Localhost bypass**: Local development (`http://localhost:5173`) bypasses CF Access
- **Local database only**: Uses separate `koodiapina_local` database
- **No production data risk**: Local environment cannot affect production data

### What's NOT Protected

Since this is a **private family app**, certain features are intentionally simple:
- **Profile PINs**: Use SHA-256 hashing (adequate for 4-digit codes preventing accidental switching)
- **No rate limiting**: Small trusted user base doesn't require it
- **No user isolation**: Family members can technically access each other's favorites (prevented by UI, not enforced by API)

This trade-off is acceptable for a private family application protected by Cloudflare Access.

## Setup

### First-Time Setup

**Note:** All commands in this section should be run from the project root directory (`/home/your-user/path/to/koodiapina.net`).

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

4. **Run schema migrations:**
   ```bash
   # Run schema migrations on local database
   for migration in migrations/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --config workers/recipes_api/wrangler.toml --file "$migration"
   done
   ```

5. **Seed test data (local only):**
   ```bash
   # Seed test recipes and profiles for development
   for seed in migrations/seeds/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --config workers/recipes_api/wrangler.toml --file "$seed"
   done
   ```
   
   This creates test profiles (including an admin user) and seed recipes.

6. **(Optional) Refresh test data from production:**
   
   To fetch fresh recipe data from production, run:
   
   ```bash
   ./migrations/seeds/prod_data/fetch_prod_data.sh
   ```
   
   Or to fetch a different number of recipes (e.g., 50):
   
   ```bash
   ./migrations/seeds/prod_data/fetch_prod_data.sh 50
   ```
   
   This script will:
   - Fetch recipes from production database
   - Convert JSON to SQL seed file
   - Load into local database

### Daily Development

1. **Start the API worker (Terminal 1):**
   ```bash
   cd workers/recipes_api
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

3. Run schema migrations:
   ```bash
   for migration in migrations/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --config workers/recipes_api/wrangler.toml --file "$migration"
   done
   ```

4. Seed test data:
   ```bash
   for seed in migrations/seeds/*.sql; do 
     npx wrangler d1 execute koodiapina_local --env local --config workers/recipes_api/wrangler.toml --file "$seed"
   done
   ```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment documentation including:
- Automatic deployment via GitHub Actions (merges to `cloudflare` branch)
- Automatic cache invalidation on deployment
- Manual deployment procedures  
- Database migrations
- Troubleshooting

### Required GitHub Secrets

For automatic deployment to work, configure these secrets at:
**https://github.com/Mitorah/koodiapina.net/settings/secrets/actions**

- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_ZONE_ID` - Your domain's zone ID (for cache purging)

Get these values from https://dash.cloudflare.com

### Cache Management

Every deployment automatically:
- Updates service worker cache version (timestamp-based)
- Purges Cloudflare edge cache
- Forces fresh content delivery to users
- **Generates unique asset filenames** with content hashes for cache-busting
- **Auto-increments version number** displayed in the app

### Versioning

The app uses **automatic semantic versioning** based on commit messages:

- **Patch** (0.0.0 → 0.0.1): Default for any commit
  ```
  fix: button alignment
  chore: update dependencies
  ```

- **Minor** (0.0.0 → 0.1.0): Include `[minor]` or `feat:` in commit message
  ```
  feat: add shopping list feature
  [minor] new recipe filter
  ```

- **Major** (0.0.0 → 1.0.0): Include `[major]` or `BREAKING CHANGE` in commit message
  ```
  [major] redesign UI
  BREAKING CHANGE: remove old API
  ```

Version is stored as git tags (no files tracked) and displayed at the bottom of the app menu. Each deployment to `cloudflare` branch automatically increments the version.

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