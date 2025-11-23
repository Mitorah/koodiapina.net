#!/bin/zsh

cd workers/recipes_api && wrangler deploy
cd ../recipe_sync_ids && wrangler deploy
cd ../recipe_sync_instructions && wrangler deploy
cd ../recipe_search_populate && wrangler deploy
