# db.py
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('cybersafe.db')
    conn.row_factory = sqlite3.Row  # Enables column-name-based access
    return conn
