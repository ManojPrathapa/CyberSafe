import sqlite3
from werkzeug.security import generate_password_hash
import requests
import time

BASE_URL = "http://127.0.0.1:5050/api"

def get_db_connection():
    conn = sqlite3.connect("cybersafe.db")
    conn.row_factory = sqlite3.Row
    return conn

conn = get_db_connection()
cursor = conn.cursor()

# Seed only if empty
cursor.execute("SELECT COUNT(*) FROM users")
if cursor.fetchone()[0] == 0:
    # USERS
    users = [
        ("student1", "student1@example.com", generate_password_hash("pass1234"), "student"),
        ("parent1", "parent1@example.com", generate_password_hash("pass123"), "parent"),
        ("mentor1", "mentor1@example.com", generate_password_hash("pass123"), "mentor"),
        ("admin1", "admin1@example.com", generate_password_hash("adminpass"), "admin"),
    ]
    cursor.executemany(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", 
        users
    )

    # Get inserted user IDs
    student_id = cursor.execute("SELECT id FROM users WHERE username = 'student1'").fetchone()[0]
    parent_id = cursor.execute("SELECT id FROM users WHERE username = 'parent1'").fetchone()[0]
    mentor_user_id = cursor.execute("SELECT id FROM users WHERE username = 'mentor1'").fetchone()[0]

    # STUDENT / PARENT / MENTOR
    cursor.execute("INSERT INTO students (user_id, age) VALUES (?, ?)", (student_id, 15))
    cursor.execute("INSERT INTO parents (user_id) VALUES (?)", (parent_id,))
    cursor.execute("""
        INSERT INTO mentors (user_id, expertise, experience_years, isApproved) 
        VALUES (?, ?, ?, 1)
    """, (mentor_user_id, "Cybersecurity", 5))

    # Parent-Student Link
    cursor.execute("""
        INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)
    """, (parent_id, student_id))
    
    conn.commit()  # Commit before API call

    # === LOGIN AS MENTOR FOR JWT ===
    print("Logging in as mentor1 for JWT...")
    login_payload = {"username": "mentor1", "password": "pass123"}
    res = requests.post(f"{BASE_URL}/login", json=login_payload)
    if res.status_code == 200:
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login successful, token obtained.")
    else:
        print("Mentor login failed:", res.status_code, res.text)
        exit(1)

    # === MODULE (via API) ===
    print("Uploading module via /api/modules/upload ...")
    module_payload = {
        "mentor_id": mentor_user_id,  # mentor_id is actually user_id from mentors table
        "title": "Cyber Hygiene",
        "description": "Learn basic cyber safety habits."
    }
    res = requests.post(f"{BASE_URL}/modules/upload", json=module_payload, headers=headers)
    if res.status_code in (200, 201):
        print("Module uploaded via API")
    else:
        print("Module upload failed:", res.status_code, res.text)
        exit(1)

    time.sleep(1)  # Let DB settle

    # Get module ID
    module_id = cursor.execute("SELECT module_id FROM modules WHERE title = 'Cyber Hygiene'").fetchone()[0]

    # === VIDEO (with mentor_id & timestamp) ===
    cursor.execute("""
        INSERT INTO videos (title, description, uploaded_by, mentor_id, module_id,video_url, isApproved,timestamp)
        VALUES (?, ?, ?, ?, ?,?,?,datetime('now'))
    """, (
        "Password Safety",
        "Why strong passwords matter.",
        mentor_user_id,   # uploaded_by = user_id from users table
        mentor_user_id,   # mentor_id = user_id from mentors table
        module_id,
        "temporary link",
        0
    ))

    # Tip
    cursor.execute("""
        INSERT INTO tips (title, content, category, source_url) 
        VALUES (?, ?, ?, ?)
    """, ("Phishing Alert", "Don’t click unknown links.", "email", "https://example.com/phishing"))
    tip_id = cursor.lastrowid

    # Quiz
    cursor.execute("INSERT INTO quizzes (module_id,mentor_id, title) VALUES (?, ?,?)", (module_id,mentor_user_id,"Cyber Quiz"))

    quiz_id = cursor.lastrowid

    # Question + Options
    cursor.execute("""
        INSERT INTO questions (quiz_id, text, explanation) VALUES (?, ?,?)
    """, (quiz_id, "What is phishing?","Phishing is a scam technique."))
    question_id = cursor.lastrowid
    cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, "A scam email", 1))
    cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, "A game", 0))

    # Quiz Attempt
    answers_json = f'{{"{question_id}": 1}}'
    cursor.execute("""
        INSERT INTO student_quiz_attempts (student_id, quiz_id, answers, score, timestamp) 
        VALUES (?, ?, ?, ?, datetime('now'))
    """, (student_id, quiz_id, answers_json, 1.0))

    # Progress
    cursor.execute("INSERT INTO student_progress (student_id, module_id, progress) VALUES (?, ?, ?)", (student_id, module_id, 0.8))

    # Doubts
    cursor.execute("""
        INSERT INTO doubts (student_id, mentor_id, module_id, question, answer) 
        VALUES (?, ?, ?, ?, ?)
    """, (student_id, mentor_user_id, module_id, "What is phishing?", "Phishing is a cyber attack tricking users."))

    # Notifications
    cursor.execute("INSERT INTO notifications (user_id, message, timestamp) VALUES (?, ?, datetime('now'))", (student_id, "New quiz available in Cyber Hygiene module"))

    # Complaints
    cursor.execute("""
        INSERT INTO complaints (filed_by, against, description, status) 
        VALUES (?, ?, ?, ?)
    """, ("student1", "mentor1", "Inappropriate reply", "open"))

    # Reports
    cursor.execute("INSERT INTO reports (student_id, quiz_id, score, duration) VALUES (?, ?, ?, ?)", (student_id, quiz_id, 1.0, "5 min"))

    # Tip Views
    cursor.execute("INSERT INTO tip_views (parent_id, tip_id, viewed_at) VALUES (?, ?, datetime('now'))", (parent_id, tip_id))

    # Alerts
    cursor.execute("INSERT INTO alerts (message, timestamp) VALUES (?, datetime('now'))", ("Reminder: Complete your pending quiz by Friday",))

    print("Seed data successfully inserted.")
else:
    print("Seed data already exists. Skipping insertion.")

conn.commit()
conn.close()