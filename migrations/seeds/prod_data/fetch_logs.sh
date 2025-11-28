#!/bin/bash
# Fetch logs from production database
# Usage: ./fetch_logs.sh [LIMIT]
# Default LIMIT is 100

set -e  # Exit on error

LIMIT=${1:-100}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "📦 Fetching $LIMIT logs from production database..."
npx wrangler d1 execute koodiapina_net_db --remote \
  --command "SELECT * FROM fetch_log ORDER BY timestamp DESC LIMIT $LIMIT" \
  --json | jq '.[0].results' > "$SCRIPT_DIR/logs_raw.json"

echo "🔄 Converting JSON to SQL seed file..."
python3 "$SCRIPT_DIR/convert_logs_to_sql.py" > "$PROJECT_ROOT/migrations/seeds/seed_logs.sql"

echo "💾 Loading into local database..."
npx wrangler d1 execute koodiapina_local --local \
  --file "$PROJECT_ROOT/migrations/seeds/seed_logs.sql"

echo "✅ Done! Logs loaded into local database."
