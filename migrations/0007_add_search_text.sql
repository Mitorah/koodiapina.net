-- Migration: Add search_text column for optimized recipe searching
-- This column will store stemmed/normalized text from recipe titles and ingredients

ALTER TABLE recipes ADD COLUMN search_text TEXT;

-- Create index for faster LIKE queries on search_text
CREATE INDEX idx_recipes_search_text ON recipes(search_text);
