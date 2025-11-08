-- Migration: Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  profile_guid TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  display_name TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  is_admin BOOLEAN DEFAULT 0
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Insert default profiles for testing (GUIDs are generated randomly each time)
INSERT INTO profiles (profile_guid, username, display_name, is_active, is_admin) 
VALUES 
  (lower(hex(randomblob(16))), 'user1', 'User One', 1, 1),
  (lower(hex(randomblob(16))), 'user2', 'User Two', 1, 0),
  (lower(hex(randomblob(16))), 'user3', 'User Three', 1, 0);
