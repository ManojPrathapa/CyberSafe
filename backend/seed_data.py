import sqlite3
from hashlib import sha256

# Connect to DB
conn = sqlite3.connect("cybersafe.db")
cursor = conn.cursor()

def hash_password(pwd):
    return sha256(pwd.encode()).hexdigest()

# Seed only if empty
cursor.execute("SELECT COUNT(*) FROM users")
if cursor.fetchone()[0] == 0:
    # USERS
    users = [
        ("student1", "student1@example.com", hash_password("pass123"), "student"),
        ("parent1", "parent1@example.com", hash_password("pass123"), "parent"),
        ("mentor1", "mentor1@example.com", hash_password("pass123"), "mentor"),
        ("admin1", "admin1@example.com", hash_password("adminpass"), "admin"),
    ]
    for u in users:
        cursor.execute("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", u)

    # Get inserted user IDs
    cursor.execute("SELECT id FROM users WHERE username = 'student1'")
    student_id = cursor.fetchone()[0]
    cursor.execute("SELECT id FROM users WHERE username = 'parent1'")
    parent_id = cursor.fetchone()[0]
    cursor.execute("SELECT id FROM users WHERE username = 'mentor1'")
    mentor_id = cursor.fetchone()[0]

    # STUDENT / PARENT / MENTOR
    cursor.execute("INSERT INTO students (user_id, age) VALUES (?, ?)", (student_id, 15))
    cursor.execute("INSERT INTO parents (user_id) VALUES (?)", (parent_id,))
    cursor.execute("INSERT INTO mentors (user_id, expertise, experience_years, is_approved) VALUES (?, ?, ?, 1)", (mentor_id, "Cybersecurity", 5))

    # Parent-Student Link
    cursor.execute("INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)", (parent_id, student_id))

    # Module & Video
    cursor.execute("INSERT INTO modules (title, description, approved) VALUES (?, ?, 1)", ("Cyber Hygiene", "Learn basic cyber safety habits."))
    module_id = cursor.lastrowid
    cursor.execute("INSERT INTO videos (title, description, uploaded_by, module_id) VALUES (?, ?, ?, ?)", ("Password Safety", "Why strong passwords matter.", mentor_id, module_id))

    # Tip
    cursor.execute("INSERT INTO tips (title, content, category, source_url) VALUES (?, ?, ?, ?)", ("Phishing Alert", "Don’t click unknown links.", "email", "https://example.com/phishing"))
    tip_id = cursor.lastrowid

    # Quiz
    cursor.execute("INSERT INTO quizzes (module_id, title) VALUES (?, ?)", (module_id, "Cyber Quiz"))
    quiz_id = cursor.lastrowid

    # Question + Options
    cursor.execute("INSERT INTO questions (quiz_id, text, explanation) VALUES (?, ?, ?)", (quiz_id, "What is phishing?", "Phishing is a scam technique."))
    question_id = cursor.lastrowid
    cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, "A scam email", 1))
    cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, "A game", 0))

    # Quiz Attempt
    answers_json = f'{{"{question_id}": 1}}'
    cursor.execute("INSERT INTO student_quiz_attempts (student_id, quiz_id, answers, score, timestamp) VALUES (?, ?, ?, ?, datetime('now'))", (student_id, quiz_id, answers_json, 1.0))

    # Progress
    cursor.execute("INSERT INTO student_progress (student_id, module_id, progress) VALUES (?, ?, ?)", (student_id, module_id, 0.8))

    # Doubts
    cursor.execute("INSERT INTO doubts (student_id, mentor_id, module_id, question, answer) VALUES (?, ?, ?, ?, ?)", (student_id, mentor_id, module_id, "What is phishing?", "Phishing is a cyber attack tricking users."))

    # Notifications
    cursor.execute("INSERT INTO notifications (user_id, message, timestamp) VALUES (?, ?, datetime('now'))", (student_id, "New quiz available in Cyber Hygiene module"))

    # Complaints
    cursor.execute("INSERT INTO complaints (filed_by, against, description, status) VALUES (?, ?, ?, ?)", ("student1", "mentor1", "Inappropriate reply", "open"))

    # Reports
    cursor.execute("INSERT INTO reports (student_id, quiz_id, score, duration) VALUES (?, ?, ?, ?)", (student_id, quiz_id, 1.0, "5 min"))

    # Tip Views
    cursor.execute("INSERT INTO tip_views (parent_id, tip_id, viewed_at) VALUES (?, ?, datetime('now'))", (parent_id, tip_id))

    # Alerts
    cursor.execute("INSERT INTO alerts (message, timestamp) VALUES (?, datetime('now'))", ("Reminder: Complete your pending quiz by Friday",))

    print("✅ Initial seed data inserted.")
else:
    print("⚠️ Seed data already exists. Skipping insertion.")

conn.commit()
conn.close()
