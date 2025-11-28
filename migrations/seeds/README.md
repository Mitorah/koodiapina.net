# Seed Data - Local Development Only

⚠️ **WARNING**: These files contain test data and should **NEVER** be run in production!

## What's in this folder?

- `seed_test_profiles.sql` - Test user accounts (user1, user2, user3)
- `seed_real_recipes.sql` - Sample recipes for development (fetched from production)
- `seed_logs.sql` - Sample fetch logs for development (fetched from production)

## Usage

Run all seed files to populate your local database:

```bash
# Navigate to the recipes_api worker directory
cd workers/recipes_api

# Run all seed files (local only)
for seed in ../../migrations/seeds/*.sql; do 
  echo "Loading $(basename $seed)..."
  npx wrangler d1 execute koodiapina_local --env local --file "$seed"
done
```

Or run individual seed files:

```bash
cd workers/recipes_api
npx wrangler d1 execute koodiapina_local --env local --file ../../migrations/seeds/seed_test_profiles.sql
npx wrangler d1 execute koodiapina_local --env local --file ../../migrations/seeds/seed_real_recipes.sql
npx wrangler d1 execute koodiapina_local --env local --file ../../migrations/seeds/seed_logs.sql
```

## Fetching Fresh Data from Production

### Recipes

```bash
cd migrations/seeds/prod_data
./fetch_prod_data.sh 60  # Fetch 60 recipes (default: 20)
```

This will:
1. Fetch recipes from production database
2. Convert to SQL seed file
3. Automatically load into local database

### Logs

```bash
cd migrations/seeds/prod_data
./fetch_logs.sh 100  # Fetch 100 logs (default: 100)
```

This will:
1. Fetch logs from production database
2. Convert to SQL seed file
3. Automatically load into local database

## Production

The GitHub Actions workflow (`../.github/workflows/deploy.yml`) automatically **skips** this folder when deploying to production. Only schema migrations from `migrations/*.sql` are applied to production.

## Adding New Seed Data

1. Create a new `.sql` file in this directory
2. Start with `DELETE FROM table_name;` to clear existing data
3. Add a warning comment at the top
4. Test locally before committing

Example:
```sql
-- Seed file for my_table
-- WARNING: Local development only!

-- Clear existing data
DELETE FROM my_table;

-- Insert test data
INSERT INTO my_table (id, name) VALUES
(1, 'Test Data 1'),
(2, 'Test Data 2');
```
