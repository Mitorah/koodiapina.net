#!/bin/bash
# Fetch test data from production database
# Usage: ./fetch_prod_data.sh [LIMIT]
# Default LIMIT is 20

set -e  # Exit on error

LIMIT=${1:-20}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "📦 Fetching $LIMIT recipes from production database..."
npx wrangler d1 execute koodiapina_net_db --remote \
  --command "SELECT * FROM recipes LIMIT $LIMIT" \
  --json | jq '.[0].results' > "$SCRIPT_DIR/recipes_raw.json"

echo "🔄 Converting JSON to SQL seed file..."
python3 "$SCRIPT_DIR/convert_to_sql.py" > "$PROJECT_ROOT/migrations/seeds/seed_real_recipes.sql"

echo "💾 Loading into local database..."
npx wrangler d1 execute koodiapina_local --env=local --local \
  --file="$PROJECT_ROOT/migrations/seeds/seed_real_recipes.sql"

echo "✅ Successfully loaded $LIMIT recipes into local database!"
