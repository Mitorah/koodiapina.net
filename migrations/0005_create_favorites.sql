-- Migration: Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  favorite_id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  profile_guid TEXT NOT NULL,
  recipe_guid TEXT NOT NULL,
  added_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (profile_guid) REFERENCES profiles(profile_guid) ON DELETE CASCADE,
  FOREIGN KEY (recipe_guid) REFERENCES recipes(recipe_guid) ON DELETE CASCADE,
  UNIQUE(profile_guid, recipe_guid)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorites_profile ON favorites(profile_guid);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe ON favorites(recipe_guid);
CREATE INDEX IF NOT EXISTS idx_favorites_added_at ON favorites(added_at);
