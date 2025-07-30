from db import get_db_connection
import json
from datetime import datetime
from flask import send_file
import csv
import io
from flask import make_response
import sqlite3




def create_user(username, email, password, role):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert into users table
    cursor.execute("""
        INSERT INTO users (username, email, password, role, isActive)
        VALUES (?, ?, ?, ?, 1)
    """, (username, email, password, role))

    # Get the ID of the newly inserted user
    user_id = cursor.lastrowid

    # Insert into the respective role table
    if role == 'student':
        cursor.execute("INSERT INTO students (user_id, age) VALUES (?, ?)", (user_id, None))
    elif role == 'parent':
        cursor.execute("INSERT INTO parents (user_id) VALUES (?)", (user_id,))
    elif role == 'mentor':
        cursor.execute("INSERT INTO mentors (user_id, expertise, experience_years) VALUES (?, ?, ?)", (user_id, '', 0))
    

    conn.commit()
    conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row  # Add this line!
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {
            'id': row['id'],
            'username': row['username'],
            'email': row['email'],
            'password': row['password'],
            'role': row['role']
        }
    return None


'''def get_user_by_username(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    return user'''

# ------------------- MODULES -------------------
def get_all_modules():
    conn = get_db_connection()
    modules = conn.execute("SELECT * FROM modules").fetchall()
    conn.close()
    return modules

# ------------------- QUIZZES -------------------

def get_quiz_with_questions(quiz_id):
    conn = get_db_connection()

    # Get quiz info
    quiz = conn.execute("""
        SELECT * FROM quizzes WHERE quiz_id = ? AND isDeleted = 0
    """, (quiz_id,)).fetchone()

    if not quiz:
        conn.close()
        return None

    # Get module info
    module = conn.execute("""
        SELECT * FROM modules WHERE module_id = ? AND isDeleted = 0
    """, (quiz["module_id"],)).fetchone()

    # Get questions (excluding deleted)
    questions = conn.execute("""
        SELECT * FROM questions WHERE quiz_id = ? AND isDeleted = 0
    """, (quiz_id,)).fetchall()

    result = []
    for q in questions:
        options = conn.execute("""
            SELECT * FROM options WHERE question_id = ? AND isDeleted = 0
        """, (q['question_id'],)).fetchall()

        result.append({
            "question_id": q["question_id"],
            "text": q["text"],
            "explanation": q["explanation"],
            "options": [{"option_id": o["option_id"], "text": o["text"]} for o in options]
        })

    conn.close()

    return {
        "quiz_id": quiz["quiz_id"],
        "title": quiz["title"],
        "module": {
            "module_id": module["module_id"] if module else None,
            "title": module["title"] if module else "Unknown"
        },
        "questions": result
    }



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

def get_attempts_for_student(student_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT * FROM student_quiz_attempts WHERE student_id = ?
    """, (student_id,)).fetchall()
    conn.close()
    return rows

def get_all_quizzes():
    conn = get_db_connection()
    quizzes = conn.execute("SELECT * FROM quizzes").fetchall()
    conn.close()
    return quizzes

# ------------------- DOUBTS -------------------
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

def reply_to_doubt(doubt_id, answer):
    conn = get_db_connection()
    conn.execute("UPDATE doubts SET answer = ? WHERE doubt_id = ?", (answer, doubt_id))
    conn.commit()
    conn.close()

# ------------------- NOTIFICATIONS -------------------
def get_notifications(user_id):
    conn = get_db_connection()
    notifs = conn.execute("""
        SELECT * FROM notifications WHERE user_id = ?
    """, (user_id,)).fetchall()
    conn.close()
    return notifs

# ------------------- REPORTS -------------------
def get_reports_for_student(student_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT * FROM reports WHERE student_id = ?
    """, (student_id,)).fetchall()
    conn.close()
    return rows

def get_reports_for_mentor(mentor_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT * FROM reports WHERE mentor_id = ?
    """, (mentor_id,)).fetchall()
    conn.close()
    return rows

# ------------------- TIPS -------------------
def get_all_tips():
    conn = get_db_connection()
    tips = conn.execute("SELECT * FROM tips").fetchall()
    conn.close()
    return tips

def get_viewed_tips_by_parent(parent_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT t.* FROM tips t
        JOIN tip_views v ON t.tip_id = v.tip_id
        WHERE v.parent_id = ?
    """, (parent_id,)).fetchall()
    conn.close()
    return rows

def mark_tip_viewed(parent_id, tip_id):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO tip_views (parent_id, tip_id, viewed_at)
        VALUES (?, ?, datetime('now'))
    """, (parent_id, tip_id))
    conn.commit()
    conn.close()

# ------------------- COMPLAINTS -------------------
def file_complaint(filed_by, against, description):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO complaints (filed_by, against, description, status)
        VALUES (?, ?, ?, 'open')
    """, (filed_by, against, description))
    conn.commit()
    conn.close()

def get_complaints():
    conn = get_db_connection()
    complaints = conn.execute("SELECT * FROM complaints").fetchall()
    conn.close()
    return complaints

def resolve_complaint(complaint_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE complaints SET status = 'resolved' WHERE complaint_id = ?
    """, (complaint_id,))
    conn.commit()
    conn.close()

# ------------------- MODULE UPLOAD -------------------


def upload_module_content(mentor_id, title, description, video_url=None, resource_link=None):
    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO modules (mentor_id, title, description, video_url, resource_link, isDeleted)
        VALUES (?, ?, ?, ?, ?, 0)
        """,
        (mentor_id, title, description, video_url, resource_link)
    )
    conn.commit()
    conn.close()



# ------------------- QUIZ CREATION -------------------
def create_quiz_with_questions(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    quiz_title = data.get('title')
    module_id = data.get('module_id')
    questions = data.get('questions', [])

    cursor.execute("INSERT INTO quizzes (module_id, title) VALUES (?, ?)", (module_id, quiz_title))
    quiz_id = cursor.lastrowid

    for q in questions:
        cursor.execute("INSERT INTO questions (quiz_id, text, explanation) VALUES (?, ?, ?)", (quiz_id, q['text'], q.get('explanation', '')))
        question_id = cursor.lastrowid
        for opt in q['options']:
            cursor.execute("INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)", (question_id, opt['text'], opt['is_correct']))

    conn.commit()
    conn.close()

# ------------------- PROFILE -------------------
def get_profile_details(user_id):
    conn = get_db_connection()
    row = conn.execute("SELECT id, username, email, role FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    return dict(row) if row else {}

def update_profile_details(args):
    conn = get_db_connection()
    fields = []
    values = []
    for field in ['username', 'email', 'password']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))
    values.append(args['user_id'])
    if fields:
        conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
    conn.close()

# ------------------- ACTIVITY -------------------
def get_student_activity(student_id):
    conn = get_db_connection()
    quizzes = conn.execute("SELECT * FROM student_quiz_attempts WHERE student_id = ?", (student_id,)).fetchall()
    modules = conn.execute("SELECT * FROM modules WHERE module_id IN (SELECT module_id FROM student_progress WHERE student_id = ?)", (student_id,)).fetchall()
    conn.close()
    return {
        "quiz_attempts": [dict(q) for q in quizzes],
        "modules_viewed": [dict(m) for m in modules]
    }

# ------------------- ADMIN -------------------
def get_all_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, username, email, role, isActive FROM users").fetchall()
    conn.close()
    return users

def get_pending_trainers():
    conn = get_db_connection()
    trainers = conn.execute("SELECT * FROM mentors WHERE isapproved = 0").fetchall()
    conn.close()
    return trainers

def get_pending_contents():
    conn = get_db_connection()
    contents = conn.execute("SELECT * FROM modules WHERE approved = 0").fetchall()
    conn.close()
    return contents




def download_user_report():
    conn = get_db_connection()
    users = conn.execute(
        "SELECT id AS user_id, username, email, role, isActive FROM users"
    ).fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["User ID", "Username", "Email", "Role", "Active"])
    for user in users:
        writer.writerow([
            user["user_id"],
            user["username"],
            user["email"],
            user["role"],
            user["isActive"]
        ])

    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=users_report.csv"
    response.headers["Content-type"] = "text/csv"
    return response
def download_summary():
    conn = get_db_connection()

    total_users = conn.execute("SELECT COUNT(*) AS count FROM users").fetchone()["count"]
    total_trainers = conn.execute("SELECT COUNT(*) AS count FROM users WHERE role = 'trainer'").fetchone()["count"]
    total_students = conn.execute("SELECT COUNT(*) AS count FROM users WHERE role = 'student'").fetchone()["count"]
    total_quizzes = conn.execute("SELECT COUNT(*) AS count FROM quizzes").fetchone()["count"]

    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Count"])
    writer.writerow(["Total Users", total_users])
    writer.writerow(["Total Trainers", total_trainers])
    writer.writerow(["Total Students", total_students])
    writer.writerow(["Total Quizzes", total_quizzes])

    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=summary_report.csv"
    response.headers["Content-type"] = "text/csv"
    return response




def block_user(user_id):
    conn = get_db_connection()
    conn.execute("UPDATE users SET isActive = 0 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

def unblock_user(user_id):
    conn = get_db_connection()
    conn.execute("UPDATE users SET isActive = 1 WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()

# ------------------- ALERTS -------------------
def post_alert(message):
    conn = get_db_connection()
    conn.execute("INSERT INTO alerts (message, timestamp) VALUES (?, datetime('now'))", (message,))
    conn.commit()
    conn.close()

'''def soft_delete_module(module_id):
    conn = get_db_connection()
    conn.execute("UPDATE modules SET isDeleted = 1 WHERE module_id = ?", (module_id,))
    conn.commit()
    conn.close()'''

def soft_delete_module(module_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE modules SET isDeleted = 1 WHERE module_id = ? AND isDeleted = 0",
        (module_id,)
    )
    conn.commit()
    result = cursor.rowcount > 0
    conn.close()
    return result





def get_all_modules():
    conn = get_db_connection()
    modules = conn.execute("SELECT * FROM modules WHERE isDeleted = 0").fetchall()
    conn.close()
    return modules

'''def soft_delete_quiz(quiz_id):
    conn = get_db_connection()
    conn.execute("UPDATE quizzes SET isDeleted = 1 WHERE quiz_id = ?", (quiz_id,))
    conn.commit()
    conn.close()'''

def soft_delete_quiz(quiz_id):
    conn = get_db_connection()
    cursor = conn.execute("UPDATE quizzes SET isDeleted = 1 WHERE quiz_id = ? AND isDeleted = 0", (quiz_id,))
    conn.commit()
    rowcount = cursor.rowcount
    conn.close()
    return rowcount > 0


def get_all_quizzes():
    conn = get_db_connection()
    quizzes = conn.execute("SELECT * FROM quizzes WHERE isDeleted = 0").fetchall()
    conn.close()
    return quizzes



def soft_delete_doubt(doubt_id):
    conn = get_db_connection()
    cursor = conn.execute("UPDATE doubts SET isDeleted = 1 WHERE doubt_id = ? AND isDeleted = 0", (doubt_id,))
    conn.commit()
    updated = cursor.rowcount
    conn.close()
    return updated > 0


def get_all_doubts():
    conn = get_db_connection()
    doubts = conn.execute("SELECT * FROM doubts WHERE isDeleted = 0").fetchall()
    conn.close()
    return doubts


def soft_delete_complaint(complaint_id):
    conn = get_db_connection()
    cursor = conn.execute("UPDATE complaints SET isDeleted = 1 WHERE complaint_id = ? AND isDeleted = 0", (complaint_id,))
    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()
    return updated_rows > 0


def get_all_complaints():
    conn = get_db_connection()
    complaints = conn.execute("SELECT * FROM complaints WHERE isDeleted = 0").fetchall()
    conn.close()
    return complaints



def soft_delete_tip(tip_id):
    conn = get_db_connection()
    cursor = conn.execute(
        "UPDATE tips SET isDeleted = 1 WHERE tip_id = ? AND isDeleted = 0",
        (tip_id,)
    )
    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()
    return updated_rows > 0


def get_all_tips():
    conn = get_db_connection()
    tips = conn.execute("SELECT * FROM tips WHERE isDeleted = 0").fetchall()
    conn.close()
    return tips




def soft_delete_report(report_id):
    conn = get_db_connection()
    cursor = conn.execute(
        "UPDATE reports SET isDeleted = 1 WHERE report_id = ? AND isDeleted = 0",
        (report_id,)
    )
    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()
    return updated_rows > 0


def get_reports_for_student(student_id):
    conn = get_db_connection()
    reports = conn.execute(
        "SELECT * FROM reports WHERE student_id = ? AND isDeleted = 0",
        (student_id,)
    ).fetchall()
    conn.close()
    return reports




def soft_delete_alert(alert_id):
    conn = get_db_connection()
    cursor = conn.execute(
        "UPDATE alerts SET isDeleted = 1 WHERE alert_id = ? AND isDeleted = 0",
        (alert_id,)
    )
    conn.commit()
    updated_rows = cursor.rowcount
    conn.close()
    return updated_rows > 0


def get_all_alerts():
    conn = get_db_connection()
    alerts = conn.execute("SELECT * FROM alerts WHERE isDeleted = 0").fetchall()
    conn.close()
    return alerts



