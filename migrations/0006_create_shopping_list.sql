-- Migration: Create shopping_list table
CREATE TABLE IF NOT EXISTS shopping_list (
  shopping_list_id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  profile_guid TEXT NOT NULL,
  recipe_guid TEXT NOT NULL,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_guid) REFERENCES profiles(profile_guid) ON DELETE CASCADE,
  FOREIGN KEY (recipe_guid) REFERENCES recipes(recipe_guid) ON DELETE CASCADE,
  UNIQUE(profile_guid, recipe_guid)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopping_list_profile ON shopping_list(profile_guid);
CREATE INDEX IF NOT EXISTS idx_shopping_list_recipe ON shopping_list(recipe_guid);
CREATE INDEX IF NOT EXISTS idx_shopping_list_added_at ON shopping_list(added_at);
