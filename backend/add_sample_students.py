import sqlite3
from werkzeug.security import generate_password_hash

def get_db_connection():
    conn = sqlite3.connect("cybersafe.db")
    conn.row_factory = sqlite3.Row
    return conn

def add_sample_students():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Sample students to add
    students = [
        ("student2", "student2@example.com", generate_password_hash("pass1234"), "student", 14),
        ("student3", "student3@example.com", generate_password_hash("pass1234"), "student", 16),
        ("student4", "student4@example.com", generate_password_hash("pass1234"), "student", 13),
        ("student5", "student5@example.com", generate_password_hash("pass1234"), "student", 15),
        ("emma_student", "emma@example.com", generate_password_hash("pass1234"), "student", 14),
        ("alex_student", "alex@example.com", generate_password_hash("pass1234"), "student", 16),
        ("sarah_student", "sarah@example.com", generate_password_hash("pass1234"), "student", 13),
        ("mike_student", "mike@example.com", generate_password_hash("pass1234"), "student", 15),
    ]
    
    added_count = 0
    
    for username, email, password, role, age in students:
        try:
            # Check if user already exists
            existing = cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email)).fetchone()
            if existing:
                print(f"User {username} already exists, skipping...")
                continue
            
            # Insert into users table
            cursor.execute("""
                INSERT INTO users (username, email, password, role, isActive)
                VALUES (?, ?, ?, ?, 1)
            """, (username, email, password, role))
            
            user_id = cursor.lastrowid
            
            # Insert into students table
            cursor.execute("INSERT INTO students (user_id, age) VALUES (?, ?)", (user_id, age))
            
            added_count += 1
            print(f"Added student: {username} (ID: {user_id})")
            
        except Exception as e:
            print(f"Error adding student {username}: {e}")
    
    conn.commit()
    print(f"\nSuccessfully added {added_count} new students!")
    
    # Show all students
    print("\nAll students in database:")
    students = cursor.execute("""
        SELECT u.id, u.username, u.email, s.age 
        FROM users u 
        JOIN students s ON u.id = s.user_id 
        WHERE u.role = 'student'
        ORDER BY u.username
    """).fetchall()
    
    for student in students:
        print(f"  ID: {student['id']}, Username: {student['username']}, Email: {student['email']}, Age: {student['age']}")
    
    conn.close()

if __name__ == "__main__":
    add_sample_students() 