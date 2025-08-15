from db import get_db_connection
import json
from datetime import datetime
from flask import send_file
import csv
import io
from flask import make_response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash




def create_user(username, email, password, role):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Start transaction
        conn.execute("BEGIN TRANSACTION")

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
        elif role == 'admin':
            cursor.execute("INSERT INTO admins (user_id) VALUES (?)", (user_id,))
        elif role == 'support':
            cursor.execute("INSERT INTO support (user_id) VALUES (?)", (user_id,))

        # Commit transaction
        conn.commit()
        
    except sqlite3.IntegrityError as e:
        if conn:
            conn.rollback()
        raise e
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error creating user: {e}")
        raise e
    finally:
        if conn:
            conn.close()

import sqlite3
from db import get_db_connection  # make sure this exists

#Update the password for a user
def update_user_password(user_id, old_password, new_password):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Get existing password hash
    cursor.execute("SELECT password FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        return False, "User not found"

    stored_hash = row[0]
    if not check_password_hash(stored_hash, old_password):
        return False, "Old password is incorrect"

    # Update with new hash
    new_hash = generate_password_hash(new_password)
    cursor.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        (new_hash, user_id)
    )
    conn.commit()
    return True, "Password updated successfully"


def get_user_by_id(user_id):
    """Fetch a user by their ID"""
    conn = get_db_connection()
    conn.row_factory = sqlite3.Row  # To access columns by name
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
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


def get_user_by_username(username):
    conn = None
    try:
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()

        if row:
            return {
                'id': row['id'],
                'username': row['username'],
                'email': row['email'],
                'password': row['password'],
                'role': row['role']
            }
        return None
    except Exception as e:
        print(f"Error getting user by username: {e}")
        return None
    finally:
        if conn:
            conn.close()


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

def get_modules_with_content():
    conn = get_db_connection()
    cur = conn.cursor()

    # Get all modules
    cur.execute("SELECT * FROM modules WHERE isDeleted = 0")
    modules = cur.fetchall()

    result = []
    for mod in modules:
        module_id = mod["module_id"]

        # Get videos for this module
        cur.execute(
            "SELECT video_id, title FROM videos WHERE module_id = ? AND isDeleted = 0",
            (module_id,)
        )
        videos = [dict(v) for v in cur.fetchall()]

        # Get quizzes for this module
        cur.execute(
            "SELECT quiz_id, title FROM quizzes WHERE module_id = ? AND isDeleted = 0",
            (module_id,)
        )
        quizzes = [dict(q) for q in cur.fetchall()]

        result.append({
            "module_id": module_id,
            "title": mod["title"],
            "description": mod["description"],
            "videos": videos,
            "quizzes": quizzes
        })

    conn.close()
    return result

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
    cursor = conn.cursor()  
    cursor.execute("""
        INSERT INTO doubts (student_id, mentor_id, module_id, question)
        VALUES (?, ?, ?, ?)
    """, (student_id, mentor_id, module_id, question))
    conn.commit()
    doubt_id = cursor.lastrowid  
    conn.close()
    return doubt_id  


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

import datetime
from db import get_db_connection


# ------------------- VIDEOS -------------------

def create_video(title, description, uploaded_by, mentor_id, module_id):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO videos (title, description, uploaded_by, mentor_id, module_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, description, uploaded_by, mentor_id, module_id, datetime.datetime.now()))
    conn.commit()
    conn.close()

def get_all_videos():
    conn = get_db_connection()
    videos = conn.execute("""
        SELECT * FROM videos
        WHERE isDeleted = 0
        ORDER BY timestamp DESC
    """).fetchall()
    conn.close()
    return videos

def get_video_by_id(video_id):
    conn = get_db_connection()
    video = conn.execute("""
        SELECT * FROM videos
        WHERE video_id = ? AND isDeleted = 0
    """, (video_id,)).fetchone()
    conn.close()
    return video

def update_video(video_id, title, description, module_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE videos
        SET title = ?, description = ?, module_id = ?
        WHERE video_id = ?
    """, (title, description, module_id, video_id))
    conn.commit()
    conn.close()

def block_video(video_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE videos
        SET isDeleted = 1
        WHERE video_id = ?
    """, (video_id,))
    conn.commit()
    conn.close()

def unblock_video(video_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE videos
        SET isDeleted = 0
        WHERE video_id = ?
    """, (video_id,))
    conn.commit()
    conn.close()

def delete_video(video_id):
    conn = get_db_connection()
    conn.execute("""
        DELETE FROM videos
        WHERE video_id = ?
    """, (video_id,))
    conn.commit()
    conn.close()

def increment_video_views(video_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE videos
        SET views = views + 1
        WHERE video_id = ? AND isDeleted = 0
    """, (video_id,))
    conn.commit()
    conn.close()

def increment_video_likes(video_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE videos
        SET likes = likes + 1
        WHERE video_id = ? AND isDeleted = 0
    """, (video_id,))
    conn.commit()
    conn.close()


# ------------------- NOTIFICATIONS -------------------

def create_notification(user_id, notif_type, message, related_id=None):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO notifications (user_id, type, related_id, message)
        VALUES (?, ?, ?, ?)
    """, (user_id, notif_type, related_id, message))
    conn.commit()
    conn.close()

def get_notifications(user_id):
    conn = get_db_connection()
    notifs = conn.execute("""
        SELECT * FROM notifications 
        WHERE user_id = ? AND isDeleted = 0
        ORDER BY timestamp DESC
    """, (user_id,)).fetchall()
    conn.close()
    return notifs

def mark_notification_read(notif_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE notifications SET isRead = 1 WHERE id = ?
    """, (notif_id,))
    conn.commit()
    conn.close()

def delete_notification(notif_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE notifications SET isDeleted = 1 WHERE id = ?
    """, (notif_id,))
    conn.commit()
    conn.close()

# ------------------- RECIPIENT HELPERS -------------------

def get_all_user_ids():
    conn = get_db_connection()
    users = conn.execute("SELECT id FROM users").fetchall()
    conn.close()
    return [u["id"] for u in users]

def get_mentor_id_for_student(student_id):
    conn = get_db_connection()
    mentor = conn.execute("""
        SELECT mentor_id FROM student_mentor WHERE student_id = ?
    """, (student_id,)).fetchone()
    conn.close()
    return mentor["mentor_id"] if mentor else None

def get_parent_id_for_student(student_id):
    conn = get_db_connection()
    parent = conn.execute("""
        SELECT parent_id FROM students WHERE id = ?
    """, (student_id,)).fetchone()
    conn.close()
    return parent["parent_id"] if parent else None

def get_admin_ids():
    conn = get_db_connection()
    admins = conn.execute("""
        SELECT id FROM users WHERE role = 'admin'
    """).fetchall()
    conn.close()
    return [a["id"] for a in admins]


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

        # Return empty list instead of raising error if no viewed tips found

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
    cursor = conn.cursor()  
    cursor.execute("""
        INSERT INTO complaints (filed_by, against, description, status)
        VALUES (?, ?, ?, 'open')
    """, (filed_by, against, description))
    conn.commit()
    complaint_id = cursor.lastrowid  
    conn.close()
    return complaint_id  


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


def upload_module_content(mentor_id, title, description):
    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO modules (mentor_id, title, description, isDeleted)
        VALUES (?, ?, ?, 0)
        """,
        (mentor_id, title, description )
    )
    conn.commit()
    conn.close()





# ------------------- QUIZ CREATION -------------------
'''def create_quiz_with_questions(data):
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
    conn.close()'''

def create_quiz_with_questions(data):
    conn = get_db_connection()
    cursor = conn.cursor()

    quiz_title = data.get('title')
    module_id = data.get('module_id')
    questions = data.get('questions', [])

    # Validate structure
    if not isinstance(questions, list):
        raise ValueError(f"'questions' must be a list, got {type(questions).__name__}")

    # Insert quiz
    cursor.execute("INSERT INTO quizzes (module_id, title) VALUES (?, ?)", (module_id, quiz_title))
    quiz_id = cursor.lastrowid

    for q in questions:
        if not isinstance(q, dict):
            raise ValueError(f"Each question must be a dict, got {type(q).__name__}")

        cursor.execute(
            "INSERT INTO questions (quiz_id, text, explanation) VALUES (?, ?, ?)",
            (quiz_id, q['text'], q.get('explanation', ''))
        )
        question_id = cursor.lastrowid

        options = q.get('options', [])
        if not isinstance(options, list):
            raise ValueError(f"'options' must be a list, got {type(options).__name__}")

        for opt in options:
            if not isinstance(opt, dict):
                raise ValueError(f"Each option must be a dict, got {type(opt).__name__}")

            cursor.execute(
                "INSERT INTO options (question_id, text, is_correct) VALUES (?, ?, ?)",
                (question_id, opt['text'], opt['is_correct'])
            )

    conn.commit()
    conn.close()
    return quiz_id


'''# ------------------- PROFILE -------------------
def get_profile_details(user_id):
    conn = get_db_connection()
    row = conn.execute("SELECT id, username, email, role FROM users WHERE id = ?", (user_id,)).fetchone()
    
    user_role=row["role"]
    if user_role=="mentor":
        row_2 = conn.execute("SELECT user_id, expertise, experience_years FROM mentors WHERE user_id = ?", (user_id,)).fetchone()
        profile_details={
            "name":row["username"],
            "email":row["email"],
            "experience":row_2["experience_years"],
            "expertise": row_2["expertise"]
        }
        conn.close()
        return profile_details
    
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
    conn.close()'''

# ------------------- PROFILE -------------------
'''def get_profile_details(user_id):
    conn = get_db_connection()
    row = conn.execute("SELECT id, username, email, role FROM users WHERE id = ?", (user_id,)).fetchone()
    
    user_role=row["role"]
    if user_role=="mentor":
        row_2 = conn.execute("SELECT user_id, expertise, experience_years FROM mentors WHERE user_id = ?", (user_id,)).fetchone()
        profile_details={
            "name":row["username"],
            "email":row["email"],
            "experience":row_2["experience_years"],
            "expertise": row_2["expertise"]
        }
        conn.close()
        return profile_details
    
    conn.close()
    return dict(row) if row else {}

def update_profile_details(args):
    conn = get_db_connection()

    #  Check if user exists
    cur = conn.execute("SELECT id FROM users WHERE id = ?", (args['user_id'],))
    user = cur.fetchone()
    if not user:
        conn.close()
        raise ValueError("User not found")

    #  Check email uniqueness
    if args.get("email"):
        cur = conn.execute(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            (args["email"], args["user_id"])
        )
        if cur.fetchone():
            conn.close()
            raise ValueError("Email already in use by another account")

    #  Check username uniqueness
    if args.get("username"):
        cur = conn.execute(
            "SELECT id FROM users WHERE username = ? AND id != ?",
            (args["username"], args["user_id"])
        )
        if cur.fetchone():
            conn.close()
            raise ValueError("Username already in use by another account")

    #  Prepare update fields
    fields = []
    values = []
    for field in ['username', 'email', 'password']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))

    # Update only if there’s something to update
    if fields:
        values.append(args['user_id'])
        conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()

    conn.close()'''

from db import get_db_connection

# ------------------- PROFILE -------------------
def get_profile_details(user_id):
    conn = get_db_connection()
    row = conn.execute(
        "SELECT id, username, email, role FROM users WHERE id = ?", 
        (user_id,)
    ).fetchone()
    
    if not row:
        conn.close()
        return {}

    user_role = row["role"]

    # Mentor profile details
    if user_role == "mentor":
        row_2 = conn.execute(
            "SELECT user_id, expertise, experience_years FROM mentors WHERE user_id = ?", 
            (user_id,)
        ).fetchone()
        profile_details = {
            "name": row["username"],
            "email": row["email"],
            "experience": row_2["experience_years"] if row_2 else None,
            "expertise": row_2["expertise"] if row_2 else None
        }
        conn.close()
        return profile_details

    # Parent profile details (with linked student)
    if user_role == "parent":
        student_row = conn.execute("""
            SELECT u.id, u.username, u.email 
            FROM parent_student ps
            JOIN users u ON ps.student_id = u.id
            WHERE ps.parent_id = ?
        """, (user_id,)).fetchone()

        profile_details = {
            "name": row["username"],
            "email": row["email"],
            "linked_student": {
                "id": student_row["id"],
                "name": student_row["username"],
                "email": student_row["email"]
            } if student_row else None
        }
        conn.close()
        return profile_details

    # Default for other roles
    conn.close()
    return dict(row)


def update_profile_details(args):
    conn = get_db_connection()

    #  Check if user exists
    cur = conn.execute("SELECT id FROM users WHERE id = ?", (args['user_id'],))
    user = cur.fetchone()
    if not user:
        conn.close()
        raise ValueError("User not found")

    #  Check email uniqueness
    if args.get("email"):
        cur = conn.execute(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            (args["email"], args["user_id"])
        )
        if cur.fetchone():
            conn.close()
            raise ValueError("Email already in use by another account")

    #  Check username uniqueness
    if args.get("username"):
        cur = conn.execute(
            "SELECT id FROM users WHERE username = ? AND id != ?",
            (args["username"], args["user_id"])
        )
        if cur.fetchone():
            conn.close()
            raise ValueError("Username already in use by another account")

    #  Prepare update fields
    fields = []
    values = []
    for field in ['username', 'email', 'password']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))

    # Update only if there’s something to update
    if fields:
        values.append(args['user_id'])
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
    cursor = conn.execute(
        "INSERT INTO alerts (message, timestamp) VALUES (?, datetime('now'))",
        (message,)
    )
    conn.commit()
    alert_id = cursor.lastrowid  # Get the inserted alert's ID
    conn.close()
    return alert_id


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

#-------------------- STUDENT DASHBOARD -------------------
def get_student_scores(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT m.title, AVG(sqa.score)
        FROM modules m
        JOIN quizzes q ON q.module_id = m.module_id
        JOIN student_quiz_attempts sqa ON sqa.quiz_id = q.quiz_id
        WHERE sqa.student_id = ?
        GROUP BY m.module_id
    """, (student_id,))
    data = [
        {"name": row[0], "score": round(row[1], 1) if row[1] else 0}
        for row in cursor.fetchall()
    ]
    conn.close()
    return data


def get_student_time_spent(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT strftime('%a', sqa.timestamp), SUM(CAST(replace(reports.duration, ' min', '') AS INTEGER))
        FROM reports
        JOIN student_quiz_attempts sqa ON sqa.quiz_id = reports.quiz_id
        WHERE reports.student_id = ?
        GROUP BY strftime('%a', sqa.timestamp)
    """, (student_id,))
    data = [{"name": row[0], "mins": row[1] if row[1] else 0} for row in cursor.fetchall()]
    conn.close()
    return data


def get_student_doubts(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM doubts WHERE student_id = ?", (student_id,))
    asked = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM doubts
        WHERE student_id = ? AND answer IS NOT NULL AND TRIM(answer) != ''
    """, (student_id,))
    resolved = cursor.fetchone()[0]

    conn.close()
    return [
        {"name": "Asked", "value": asked},
        {"name": "Resolved", "value": resolved}
    ]


def get_module_progress(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM modules")
    total_modules = cursor.fetchone()[0]

    cursor.execute("""
        SELECT COUNT(*) FROM student_progress
        WHERE student_id = ? AND progress >= 100
    """, (student_id,))
    completed = cursor.fetchone()[0]

    conn.close()
    return [
        {"name": "Completed", "modules": completed},
        {"name": "Remaining", "modules": total_modules - completed}
    ]
    

#----------------MENTOR DASHBOARD------------------------------#
def get_mentor_video_status(user_id):
    conn=get_db_connection()
    mentor_videos=conn.execute("SELECT * FROM videos WHERE mentor_id= ? AND isDeleted = 0",(user_id,)).fetchall()
    conn.close()
    return mentor_videos

def get_mentor_doubt_status(user_id):
    conn=get_db_connection()
    mentor_doubts=conn.execute("SELECT * FROM doubts WHERE mentor_id= ? AND isDeleted = 0",(user_id,)).fetchall()
    conn.close()
    return mentor_doubts