#!/bin/zsh
cd workers/recipe_sync_ids && wrangler deploy
cd ../recipe_sync_instructions && wrangler deploy
