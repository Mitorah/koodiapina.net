-- Migration: Create recipes table for local D1
CREATE TABLE IF NOT EXISTS recipes (
  recipe_guid TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  added_date TEXT,
  details TEXT,
  instructions TEXT
);
