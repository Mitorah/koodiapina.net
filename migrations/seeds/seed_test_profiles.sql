-- Seed: Test profiles for local development
-- WARNING: Do NOT run this in production!

-- Insert test profiles (GUIDs are generated randomly)
INSERT OR IGNORE INTO profiles (profile_guid, username, display_name, is_active, is_admin) 
VALUES 
  (lower(hex(randomblob(16))), 'user1', 'User One', 1, 1),
  (lower(hex(randomblob(16))), 'user2', 'User Two', 1, 0),
  (lower(hex(randomblob(16))), 'user3', 'User Three', 1, 0);
