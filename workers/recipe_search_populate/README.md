# Recipe Search Implementation

## Overview
This implementation adds efficient recipe search functionality with Finnish language support using stemming.

## Components

### 1. Migration: `0007_add_search_text.sql`
Adds `search_text` column to recipes table with index for optimized searching.

**Run migration:**
```bash
wrangler d1 execute koodiapina-db --local --file=migrations/0007_add_search_text.sql
wrangler d1 execute koodiapina-db --remote --file=migrations/0007_add_search_text.sql
```

### 2. Search Population Worker
**Location:** `workers/recipe_search_populate/`

**Features:**
- Processes 100 recipes per run
- Extracts ingredients and titles
- Removes measurements (kg, g, rkl, etc.)
- Stems Finnish words (peruna, perunoita → perun)
- Runs daily at 3 AM Helsinki time

**Example parsing:**
- Input: `"1 kg perunoita"` → Output: `"perun"`
- Input: `"2 rkl sokeria"` → Output: `"soker"`
- Input: `"Perunakeitto"` → Output: `"perunakeitto perun"`

**Deploy:**
```bash
cd workers/recipe_search_populate
wrangler deploy
```

**Manual trigger (for initial population):**
```bash
curl -X POST https://recipe-search-populate.YOUR-SUBDOMAIN.workers.dev/populate
```

**Configure database ID:**
Edit `workers/recipe_search_populate/wrangler.toml` and update `database_id`.

### 3. Updated API Endpoint
**Location:** `workers/recipes_api/worker.js`

**New search parameter:**
```
GET /recipes?search=peruna&page=1&limit=20
GET /recipes?q=kaali&page=1
```

**How it works:**
1. User searches for "perunoita"
2. API stems query → "perun"
3. SQL: `WHERE LOWER(search_text) LIKE '%perun%'`
4. Matches recipes with: peruna, perunat, perunoita, perunaa

**Redeploy API:**
```bash
cd workers/recipes_api
wrangler deploy
```

## Finnish Stemming Rules

The stemmer removes common Finnish suffixes:

- Possessive: ni, si, nsa, mme, nne
- Partitive plural: oita, öitä, ita
- Partitive singular: aa, ää, ta, tä
- Plural markers: jen, en, in, ien, ten, den
- Case endings: ssa, sta, lla, lta, lle, etc.

**Examples:**
- perunoita → perun
- kaalia → kaal
- sipulia → sipul
- tomaatti → tomaatt

## Deployment Steps

1. **Run migration** (adds search_text column)
2. **Deploy search worker** (processes recipes daily)
3. **Trigger initial population** (populate existing recipes)
4. **Deploy updated API** (enable search queries)

## Testing

```bash
# Search for recipes with potatoes
curl "https://your-api.workers.dev/recipes?search=peruna"

# Search for cabbage (any form)
curl "https://your-api.workers.dev/recipes?search=kaali"

# Search with pagination
curl "https://your-api.workers.dev/recipes?search=tomaatti&page=1&limit=10"
```

## Notes

- The worker processes NULL search_text entries first
- Repopulating all recipes is cheap (can be done anytime)
- Search works with partial words: "peru" finds "peruna", "perunoita"
- Measurement units (kg, l, rkl) are automatically filtered out
