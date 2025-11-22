-- Migration: Create hidden_recipes table
CREATE TABLE IF NOT EXISTS hidden_recipes (
  hidden_id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  profile_guid TEXT NOT NULL,
  recipe_guid TEXT NOT NULL,
  hidden_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_guid) REFERENCES profiles(profile_guid) ON DELETE CASCADE,
  FOREIGN KEY (recipe_guid) REFERENCES recipes(recipe_guid) ON DELETE CASCADE,
  UNIQUE(profile_guid, recipe_guid)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_hidden_recipes_profile ON hidden_recipes(profile_guid);
CREATE INDEX IF NOT EXISTS idx_hidden_recipes_recipe ON hidden_recipes(recipe_guid);
CREATE INDEX IF NOT EXISTS idx_hidden_recipes_hidden_at ON hidden_recipes(hidden_at);
