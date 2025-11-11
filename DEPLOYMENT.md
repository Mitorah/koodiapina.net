# Deployment Guide

This document describes the deployment setup and workflow for koodiapina.net.

## Architecture Overview

The application consists of three main components:

1. **Frontend** - Vue.js SPA hosted on Cloudflare Pages
2. **API Worker** - Cloudflare Worker handling all API endpoints
3. **Database** - Cloudflare D1 (SQLite) database

## Infrastructure

### Production URLs
- **Frontend**: https://www.koodiapina.net
- **API Worker**: https://koodiapina-net.leinonen-op.workers.dev
- **Database**: `koodiapina_net_db` (ID: `58fd57d4-0c4b-496b-89ff-98be9389c35c`)

### Local Development
- **Frontend**: http://localhost:5173
- **API Worker**: http://localhost:8787
- **Database**: `koodiapina_local` (ID: `6617b859-12c5-4002-bdf5-34c96cd18c6d`)

## Deployment Branches

- **`main`**: Development branch for new features
- **`cloudflare`**: Production deployment branch (auto-deploys to production)
- **`issue/*`**: Feature branches for specific issues

## Automatic Deployment

### How It Works

When you merge a PR to the `cloudflare` branch, GitHub Actions automatically:

1. ✅ Runs all database migrations (idempotent - safe to run multiple times)
2. ✅ Builds the Vue.js frontend
3. ✅ Deploys the API worker to Cloudflare Workers
4. ✅ Deploys the frontend to Cloudflare Pages

### Deployment Workflow

```
Issue Branch → PR → Merge to cloudflare → Auto Deploy
```

**Example workflow:**
```bash
# Create feature branch
git checkout -b issue/25_new_feature

# Make changes, commit
git add .
git commit -m "Add new feature"
git push origin issue/25_new_feature

# Create PR on GitHub: issue/25_new_feature → cloudflare
# Review and merge PR
# GitHub Actions automatically deploys everything!
```

### Monitoring Deployment

1. Go to https://github.com/Mitorah/koodiapina.net/actions
2. Find your workflow run (triggered by the merge)
3. Watch the progress in real-time
4. Check the deployment summary at the end

## Manual Deployment (if needed)

### Deploy API Worker Only
```bash
npx wrangler deploy
```

### Deploy Frontend Only
```bash
npm run build
npx wrangler pages deploy ./dist --project-name=koodiapina-net
```

### Run Migrations Only
```bash
# Production
npx wrangler d1 execute koodiapina_net_db --remote --file migrations/0004_create_profiles.sql

# Local
npx wrangler d1 execute koodiapina_local --local --file migrations/0004_create_profiles.sql
```

## Database Migrations

### Creating a New Migration

1. Create a new file in `migrations/` directory:
   ```bash
   touch migrations/0007_add_new_feature.sql
   ```

2. Write idempotent SQL (uses `IF NOT EXISTS`):
   ```sql
   -- Create table only if it doesn't exist
   CREATE TABLE IF NOT EXISTS my_new_table (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL
   );
   
   -- Add column only if it doesn't exist
   -- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE
   -- Use a workaround or handle errors gracefully
   ```

3. Test locally:
   ```bash
   npx wrangler d1 execute koodiapina_local --local --file migrations/0007_add_new_feature.sql
   ```

4. Commit and push - it will auto-deploy when merged to `cloudflare`

### Migration Best Practices

- ✅ Always use `IF NOT EXISTS` where possible
- ✅ Number migrations sequentially (0001, 0002, etc.)
- ✅ Keep migrations small and focused
- ✅ Test locally before committing
- ❌ Never modify existing migration files
- ❌ Never delete migration files

## GitHub Secrets Setup (One-time)

### Required Secrets

1. **`CLOUDFLARE_API_TOKEN`**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create Custom Token with:
     - D1 → Edit
     - Cloudflare Pages → Edit
     - Workers Scripts → Edit
   - Copy token and add to GitHub

2. **`CLOUDFLARE_ACCOUNT_ID`**
   - Find at https://dash.cloudflare.com → Workers & Pages
   - Visible in right sidebar
   - Add to GitHub

### Adding Secrets to GitHub

1. Go to https://github.com/Mitorah/koodiapina.net/settings/secrets/actions
2. Click "New repository secret"
3. Add name and value
4. Click "Add secret"

## Local Development

For local development setup and daily workflow, see [README.md](./README.md#setup).

This section covers deployment-specific local operations.

### Running Migrations Locally

Test migrations locally before deploying:

```bash
# Run a specific migration
npx wrangler d1 execute koodiapina_local --env local --file migrations/0007_add_new_feature.sql

# Or run all migrations (see README.md for the loop command)
```

## Configuration Files

### `wrangler.toml`
Configures Cloudflare Worker and database bindings:
- Production database binding (default)
- Local database binding (env.local)

### `.github/workflows/deploy.yml`
GitHub Actions workflow that handles automatic deployment on merge to `cloudflare` branch.

### `src/utils/api.js`
API client that automatically switches between local and production API:
- Development: `http://localhost:8787`
- Production: `https://koodiapina-net.leinonen-op.workers.dev`

## Troubleshooting

### "Profiles not loading in production"
- Check API URL in `src/utils/api.js` points to correct worker
- Verify worker is deployed: `curl https://koodiapina-net.leinonen-op.workers.dev/profiles`
- Check browser console for errors

### "Migration failed"
- Usually means migration already exists (safe to ignore)
- Check if migration syntax is correct
- Verify database binding in `wrangler.toml`

### "Worker deployment failed"
- Verify GitHub secrets are set correctly
- Check API token has correct permissions
- Review GitHub Actions logs for specific error

### "Pages deployment failed"
- Check that `dist` directory was created during build
- Verify project name matches in workflow and Cloudflare dashboard
- Check build logs in GitHub Actions

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  profile_guid TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  is_admin INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  profile_guid TEXT NOT NULL,
  recipe_guid TEXT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_guid, recipe_guid),
  FOREIGN KEY (profile_guid) REFERENCES profiles(profile_guid)
);
```

### Shopping List Table
```sql
CREATE TABLE shopping_list (
  profile_guid TEXT NOT NULL,
  recipe_guid TEXT NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (profile_guid, recipe_guid),
  FOREIGN KEY (profile_guid) REFERENCES profiles(profile_guid)
);
```

## API Endpoints

### Recipes
- `GET /` - List recipes with pagination
- `GET /{recipe_guid}` - Get single recipe

### Profiles
- `GET /profiles` - List all profiles
- `POST /profiles` - Create new profile (admin only)

### Favorites
- `GET /favorites/{profile_guid}` - Get user's favorites
- `POST /favorites` - Add recipe to favorites
- `DELETE /favorites/{profile_guid}/{recipe_guid}` - Remove from favorites

### Shopping List
- `GET /shopping-list/{profile_guid}` - Get user's shopping list
- `POST /shopping-list` - Add recipe to shopping list
- `DELETE /shopping-list/{profile_guid}/{recipe_guid}` - Remove from shopping list

## Support

For issues or questions:
1. Check GitHub Actions logs for deployment issues
2. Check browser console for frontend errors
3. Use `npx wrangler tail` to view real-time worker logs
4. Check Cloudflare dashboard for worker analytics
