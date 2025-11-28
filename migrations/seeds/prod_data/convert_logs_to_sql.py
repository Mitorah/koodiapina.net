#!/usr/bin/env python3
"""
Convert logs from JSON to SQL INSERT statements.
"""

import json
import sys
import os

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return s.replace("'", "''")

def format_log_insert(log):
    """Convert a log dict to SQL INSERT VALUES format"""
    timestamp = log.get('timestamp', '')
    count = log.get('count', 0)
    status = escape_sql_string(log.get('status', ''))
    error = log.get('error')
    details = log.get('details')
    
    # Format the values
    timestamp_val = f"'{timestamp}'" if timestamp else 'NULL'
    count_val = str(count) if count else '0'
    status_val = f"'{status}'" if status != 'NULL' else 'NULL'
    error_val = f"'{escape_sql_string(error)}'" if error else 'NULL'
    details_val = f"'{escape_sql_string(details)}'" if details else 'NULL'
    
    return f"({timestamp_val}, {count_val}, {status_val}, {error_val}, {details_val})"

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, 'logs_raw.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            logs = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_path} not found", file=sys.stderr)
        print("Run fetch_logs.sh first to download the data", file=sys.stderr)
        sys.exit(1)
    
    if not logs:
        print("-- No logs to seed", file=sys.stderr)
        sys.exit(0)
    
    # Generate SQL
    print("-- Seed file for fetch_log table")
    print("-- Generated from production data")
    print()
    print("-- Clear existing logs (optional)")
    print("-- DELETE FROM fetch_log;")
    print()
    print("-- Insert logs")
    print("INSERT INTO fetch_log (timestamp, count, status, error, details) VALUES")
    
    values = [format_log_insert(log) for log in logs]
    print(",\n".join(values) + ";")
    
    print()
    print(f"-- Inserted {len(logs)} log entries")

if __name__ == '__main__':
    main()
