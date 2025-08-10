import sqlite3
import threading
import time

def get_db_connection():
    max_retries = 3
    retry_delay = 1
    
    for attempt in range(max_retries):
        try:
            conn = sqlite3.connect('cybersafe.db', timeout=30.0)
            conn.row_factory = sqlite3.Row  # Enables column-name-based access
            
            # Set pragmas for better performance and concurrency
            conn.execute("PRAGMA journal_mode=WAL")
            conn.execute("PRAGMA synchronous=NORMAL")
            conn.execute("PRAGMA cache_size=10000")
            conn.execute("PRAGMA temp_store=MEMORY")
            
            return conn
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e) and attempt < max_retries - 1:
                print(f"Database locked, retrying in {retry_delay} seconds... (attempt {attempt + 1}/{max_retries})")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                raise e
        except Exception as e:
            print(f"Database connection error: {e}")
            raise e
    
    raise sqlite3.OperationalError("Database is locked after multiple retries")
