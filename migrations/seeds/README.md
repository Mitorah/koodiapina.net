# Seed Data - Local Development Only

⚠️ **WARNING**: These files contain test data and should **NEVER** be run in production!

## What's in this folder?

- `seed_test_profiles.sql` - Test user accounts (user1, user2, user3)
- `seed_real_recipes.sql` - Sample recipes for development

## Usage

These files are automatically applied when setting up local development:

```bash
# Run all seed files (local only)
for seed in migrations/seeds/*.sql; do 
  npx wrangler d1 execute koodiapina_local --env local --file "$seed"
done
```

## Production

The GitHub Actions workflow (`../.github/workflows/deploy.yml`) automatically **skips** this folder when deploying to production. Only schema migrations from `migrations/*.sql` are applied to production.

## Adding New Seed Data

1. Create a new `.sql` file in this directory
2. Use `INSERT OR IGNORE` to make it idempotent
3. Add a warning comment at the top
4. Test locally before committing

Example:
```sql
-- WARNING: Local development only!
INSERT OR IGNORE INTO my_table (id, name) VALUES (1, 'Test Data');
```
