from db import get_db_connection
import json
from datetime import datetime

def create_user(username, email, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (username, email, password, role, is_active)
        VALUES (?, ?, ?, ?, 1)
    """, (username, email, password, role))
    conn.commit()
    conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user



def get_all_modules():
    conn = get_db_connection()
    modules = conn.execute("SELECT * FROM modules").fetchall()
    conn.close()
    return modules

def get_quiz_with_questions(quiz_id):
    conn = get_db_connection()
    quiz = conn.execute("SELECT * FROM quizzes WHERE quiz_id = ?", (quiz_id,)).fetchone()
    if not quiz:
        conn.close()
        return None

    questions = conn.execute("SELECT * FROM questions WHERE quiz_id = ?", (quiz_id,)).fetchall()
    result = []

    for q in questions:
        options = conn.execute("SELECT * FROM options WHERE question_id = ?", (q['question_id'],)).fetchall()
        result.append({
            "question_id": q["question_id"],
            "text": q["text"],
            "options": [{"option_id": o["option_id"], "text": o["text"]} for o in options]
        })

    conn.close()
    return {"quiz_id": quiz_id, "questions": result}

def evaluate_quiz(quiz_id, answers_dict):
    conn = get_db_connection()
    score = 0.0
    total = 0

    for qid, chosen_oid in answers_dict.items():
        correct = conn.execute("""
            SELECT is_correct FROM options WHERE question_id = ? AND option_id = ?
        """, (qid, chosen_oid)).fetchone()
        if correct and correct['is_correct']:
            score += 1
        total += 1

    conn.close()
    return {"score": score, "total": total}

def ask_doubt(student_id, mentor_id, module_id, question):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO doubts (student_id, mentor_id, module_id, question)
        VALUES (?, ?, ?, ?)
    """, (student_id, mentor_id, module_id, question))
    conn.commit()
    conn.close()

def get_doubts_for_mentor(mentor_id):
    conn = get_db_connection()
    doubts = conn.execute("""
        SELECT * FROM doubts WHERE mentor_id = ?
    """, (mentor_id,)).fetchall()
    conn.close()
    return doubts

def get_attempts_for_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT * FROM student_quiz_attempts WHERE student_id = ?
    """, (student_id,)).fetchall()
    conn.close()
    return rows

def get_all_quizzes():
    conn = get_db_connection()
    quizzes = conn.execute("SELECT * FROM quizzes").fetchall()
    conn.close()
    return quizzes

def get_notifications(user_id):
    conn = get_db_connection()
    notifs = conn.execute("""
        SELECT * FROM notifications WHERE user_id = ?
    """, (user_id,)).fetchall()
    conn.close()
    return notifs

def get_reports_for_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT * FROM reports WHERE student_id = ?
    """, (student_id,)).fetchall()
    conn.close()
    return rows

def get_reports_for_mentor(mentor_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT * FROM reports WHERE mentor_id = ?
    """, (mentor_id,)).fetchall()
    conn.close()
    return rows

# 🔹 Get all cyber safety tips
def get_all_tips():
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM tips").fetchall()
    conn.close()
    return rows

# 🔹 Get viewed tips by a parent
def get_viewed_tips_by_parent(parent_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("""
        SELECT t.* FROM tips t
        JOIN tip_views v ON t.tip_id = v.tip_id
        WHERE v.parent_id = ?
    """, (parent_id,)).fetchall()
    conn.close()
    return rows

# 🔹 Mark a tip as viewed
def mark_tip_viewed(parent_id, tip_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tip_views (parent_id, tip_id, viewed_at)
        VALUES (?, ?, datetime('now'))
    """, (parent_id, tip_id))
    conn.commit()
    conn.close()

# 🔹 File a new complaint
def file_complaint(filed_by, against, description):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO complaints (filed_by, against, description, status)
        VALUES (?, ?, ?, 'open')
    """, (filed_by, against, description))
    conn.commit()
    conn.close()

# 🔹 Get all complaints
def get_complaints():
    conn = get_db_connection()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM complaints").fetchall()
    conn.close()
    return rows

# 🔹 Resolve a complaint
def resolve_complaint(complaint_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE complaints
        SET status = 'resolved'
        WHERE complaint_id = ?
    """, (complaint_id,))
    conn.commit()
    conn.close()



# ------------------------------
# 🔹 Create and Upload Quiz
# ------------------------------
def create_quiz_with_questions(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    quiz_title = data.get('title')
    module_id = data.get('module_id')
    questions = data.get('questions', [])

    cursor.execute("INSERT INTO quizzes (module_id) VALUES (?)", (module_id,))
    quiz_id = cursor.lastrowid

    for q in questions:
        cursor.execute("INSERT INTO questions (text, explanation) VALUES (?, ?)", (q['text'], q.get('explanation', '')))
        question_id = cursor.lastrowid
        for opt in q['options']:
            cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, opt['text'], opt['is_correct']))

    conn.commit()
    conn.close()

# ------------------------------
# 🔹 Upload Module Files
# ------------------------------
def upload_module_content(mentor_id, title, description):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO modules (title, description) VALUES (?, ?)", (title, description))
    conn.commit()
    conn.close()

# ------------------------------
# 🔹 Get Student Activity
# ------------------------------
def get_student_activity(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    quizzes = cursor.execute("SELECT * FROM student_quiz_attempts WHERE student_id = ?", (student_id,)).fetchall()
    modules = cursor.execute("SELECT * FROM modules WHERE module_id IN (SELECT module_id FROM student_progress WHERE student_id = ?)", (student_id,)).fetchall()
    conn.close()
    return {
        "quiz_attempts": [dict(q) for q in quizzes],
        "modules_viewed": [dict(m) for m in modules]
    }

# ------------------------------
# 🔹 Get / Edit Profile
# ------------------------------
def get_profile_details(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    row = cursor.execute("SELECT id, username, email, role FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else {}

def update_profile_details(args):
    conn = get_db_connection()
    cursor = conn.cursor()
    fields = []
    values = []
    for field in ['username', 'email', 'password']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))
    values.append(args['user_id'])
    if fields:
        cursor.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    conn.close()

# ------------------------------
# 🔹 Post Reply to Doubts
# ------------------------------
def reply_to_doubt(doubt_id, answer):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE doubts SET answer = ? WHERE doubt_id = ?", (answer, doubt_id))
    conn.commit()
    conn.close()

# ------------------------------
# 🔹 Admin: All Users / Approvals / Reports
# ------------------------------
def get_all_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, username, email, role, isActive FROM users").fetchall()
    conn.close()
    return users

def get_pending_trainers():
    conn = get_db_connection()
    trainers = conn.execute("SELECT * FROM users WHERE role = 'Mentor' AND isApproved = 0").fetchall()
    conn.close()
    return trainers

def get_pending_contents():
    conn = get_db_connection()
    contents = conn.execute("SELECT * FROM modules WHERE approved = 0").fetchall()
    conn.close()
    return contents

def download_user_report():
    # dummy implementation
    return {"report": "Monthly user report data (PDF/CSV placeholder)"}

def download_summary():
    # dummy implementation
    return {"summary": "Monthly app usage summary (PDF/CSV placeholder)"}

def block_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET isActive = 0 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

def unblock_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET isActive = 1 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

# ------------------------------
# 🔹 Support Team: Post Alert
# ------------------------------
def post_alert(message):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO alerts (message, timestamp) VALUES (?, datetime('now'))", (message,))
    conn.commit()
    conn.close()










def save_quiz_attempt(student_id, quiz_id, answers_dict, score):
    conn = get_db_connection()
    cursor = conn.cursor()

    answers_json = json.dumps(answers_dict)
    timestamp = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO student_quiz_attempts (student_id, quiz_id, answers, score, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (student_id, quiz_id, answers_json, score, timestamp))

    conn.commit()
    conn.close()

