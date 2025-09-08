-- Migration: Create fetch_log table for local D1
CREATE TABLE IF NOT EXISTS fetch_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT,
  count INTEGER,
  status TEXT,
  error TEXT,
  details TEXT
);
