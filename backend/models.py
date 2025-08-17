from db import get_db_connection
import json
from datetime import datetime
from flask import send_file
import csv
import io
from flask import make_response
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash


import traceback

def safe_execute(query, params=(), fetchone=False):
    """Safely execute a query and handle DB errors with logging."""
    try:
        conn = get_db_connection()
        cur = conn.execute(query, params)
        result = cur.fetchone() if fetchone else cur.fetchall()
        conn.close()
        return result
    except Exception as e:
        print("DB ERROR:", e)
        traceback.print_exc()
        return None if fetchone else []


def create_user(username, email, password, role,isActive):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Start transaction
        conn.execute("BEGIN TRANSACTION")

        # Insert into users table
        cursor.execute("""
            INSERT INTO users (username, email, password, role, isActive)
            VALUES (?, ?, ?, ?, ?)
        """, (username, email, password, role,isActive))

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
                'role': row['role'],
                'isActive': row['isActive'] 
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
            "SELECT video_id, video_url, title FROM videos WHERE module_id = ? AND isDeleted = 0",
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

def get_quiz_with_questions(user_id):
    conn = get_db_connection()

    # Get quiz info
    quizzes = conn.execute("""
        SELECT * FROM quizzes WHERE mentor_id = ? AND isDeleted = 0
    """, (user_id,)).fetchall()
    
    quizzes_list=[]
    
    for quiz in quizzes:
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
        """, (quiz["quiz_id"],)).fetchall()

         questions_list = []
         for q in questions:
           options = conn.execute("""
            SELECT * FROM options WHERE question_id = ? AND isDeleted = 0
            """, (q['question_id'],)).fetchall()

           questions_list.append({
            "question_id": q["question_id"],
            "text": q["text"],
            "explanation": q["explanation"],
            "options": [{"option_id": o["option_id"], "text": o["text"]} for o in options]
        })
         if module is not None:
            quizzes_list.append({
                 "quiz_id":quiz["quiz_id"],
                 "quiz_title":quiz["title"],
                 "module_id":module["module_id"],
                 "module_title":module["description"],
                 "questions_list":questions_list
            
                   })
         else:
               quizzes_list.append({
                 "quiz_id":quiz["quiz_id"],
                 "quiz_title":quiz["title"],
                 "module_id":"",
                 "module_title":"",
                 "questions_list":questions_list
            
                   })
        

    conn.close()
    
    return quizzes_list

    #return {
    #    "quiz_id": quiz["quiz_id"],
    #    "title": quiz["title"],
    #    "module": {
    #        "module_id": module["module_id"] if module else None,
    #        "title": module["title"] if module else "Unknown"
    #    },
    #    "questions": result
    #}

# --- New: get quizzes for a module (student-facing; hides is_correct) ---
def get_quizzes_for_module(module_id):
    """
    Return a list of quizzes for a given module_id.
    Each quiz contains quiz_id, quiz_title, module_id and questions_list.
    Options returned do NOT include is_correct (student-facing).
    """
    conn = get_db_connection()

    quizzes = conn.execute("""
        SELECT * FROM quizzes WHERE module_id = ? AND isDeleted = 0
    """, (module_id,)).fetchall()

    quizzes_list = []

    for quiz in quizzes:
        # Get questions (excluding deleted)
        questions = conn.execute("""
            SELECT * FROM questions WHERE quiz_id = ? AND isDeleted = 0
        """, (quiz["quiz_id"],)).fetchall()

        questions_list = []
        for q in questions:
            options = conn.execute("""
                SELECT option_id, text FROM options WHERE question_id = ? AND isDeleted = 0
            """, (q['question_id'],)).fetchall()

            # Use indexing on sqlite3.Row (no .get())
            explanation = q["explanation"] if "explanation" in q.keys() and q["explanation"] is not None else ""
            question_text = q["text"] if "text" in q.keys() and q["text"] is not None else ""

            questions_list.append({
                "question_id": q["question_id"],
                "text": question_text,
                "explanation": explanation,
                "options": [{"option_id": o["option_id"], "text": o["text"]} for o in options]
            })

        quiz_title = quiz["title"] if "title" in quiz.keys() and quiz["title"] is not None else ""
        quizzes_list.append({
            "quiz_id": quiz["quiz_id"],
            "quiz_title": quiz_title,
            "module_id": quiz["module_id"],
            "questions_list": questions_list
        })

    conn.close()
    return quizzes_list


def evaluate_quiz(quiz_id, answers_dict):
    """
    answers_dict: mapping question_id -> chosen_option_id
    (keys may be strings if coming from JSON; convert to int)
    Returns: {"score": score, "total": total}
    """
    conn = get_db_connection()
    score = 0.0
    total = 0

    for qid_str, chosen_oid in answers_dict.items():
        try:
            qid = int(qid_str)
            chosen_oid_int = int(chosen_oid)
        except (ValueError, TypeError):
            # skip malformed entries
            continue

        correct = conn.execute("""
            SELECT is_correct FROM options WHERE question_id = ? AND option_id = ?
        """, (qid, chosen_oid_int)).fetchone()

        if correct and correct["is_correct"]:
            score += 1
        total += 1

    conn.close()
    return {"score": score, "total": total}

def save_quiz_attempt(student_id, quiz_id, answers_dict, score):
    conn = get_db_connection()
    cursor = conn.cursor()

    answers_json = json.dumps(answers_dict)
    timestamp = datetime.datetime.now().isoformat()

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

def get_doubts_for_student(student_id):
    conn = get_db_connection()
    doubts = conn.execute("""
        SELECT d.*, m.title AS module_title
        FROM doubts d
        LEFT JOIN modules m ON d.module_id = m.module_id
        WHERE d.student_id = ? AND d.isDeleted = 0
        ORDER BY d.timestamp DESC
    """, (student_id,)).fetchall()
    conn.close()
    return doubts


def update_doubt(doubt_id, question, module_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE doubts
        SET question = ?, module_id = ?
        WHERE doubt_id = ? AND isDeleted = 0
    """, (question, module_id, doubt_id))
    conn.commit()
    conn.close()


def soft_delete_doubt(doubt_id):
    conn = get_db_connection()
    conn.execute("""
        UPDATE doubts
        SET isDeleted = 1
        WHERE doubt_id = ?
    """, (doubt_id,))
    conn.commit()
    changes = conn.total_changes
    conn.close()
    return changes > 0



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

def get_mentor_for_module(module_id):
    """
    Returns mentor info for a module.
    If module.mentor_id is present, returns that mentor (joined with users table).
    Otherwise returns first approved mentor as fallback (or None if none).
    """
    conn = get_db_connection()
    # Try module's assigned mentor
    mentor = conn.execute("""
        SELECT m.user_id AS mentor_id,
               u.username,
               u.email,
               m.expertise,
               m.experience_years,
               m.isApproved
        FROM modules mod
        LEFT JOIN mentors m ON mod.mentor_id = m.user_id
        LEFT JOIN users u ON m.user_id = u.id
        WHERE mod.module_id = ? AND mod.isDeleted = 0
    """, (module_id,)).fetchone()

    if mentor and mentor["mentor_id"]:
        conn.close()
        return mentor

    # Fallback: pick first approved mentor
    fallback = conn.execute("""
        SELECT m.user_id AS mentor_id,
               u.username,
               u.email,
               m.expertise,
               m.experience_years,
               m.isApproved
        FROM mentors m
        JOIN users u ON m.user_id = u.id
        WHERE m.isApproved = 1 AND u.isDeleted = 0
        LIMIT 1
    """).fetchone()

    conn.close()
    return fallback



# ------------------- VIDEOS -------------------


import datetime
from db import get_db_connection

def create_video(title, description, uploaded_by, mentor_id, module_id,video_url):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO videos (title, description, uploaded_by, mentor_id, module_id,video_url,timestamp)
        VALUES (?, ?, ?, ?, ?, ?,?)
    """, (title, description, uploaded_by, mentor_id, module_id,video_url, datetime.datetime.now()))
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
    return [dict(n) for n in notifs]

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
    
    # Get quiz attempts as reports with enhanced data
    reports = conn.execute("""
        SELECT 
            sqa.attempt_id as report_id,
            sqa.student_id,
            sqa.quiz_id,
            sqa.score,
            sqa.timestamp,
            q.title as quiz_title,
            m.title as module_title
        FROM student_quiz_attempts sqa
        LEFT JOIN quizzes q ON sqa.quiz_id = q.quiz_id
        LEFT JOIN modules m ON q.module_id = m.module_id
        WHERE sqa.student_id = ?
        ORDER BY sqa.timestamp DESC
    """, (student_id,)).fetchall()
    
    # Convert to list of dictionaries with enhanced structure
    result = []
    for report in reports:
        report_dict = dict(report)
        
        # Calculate duration (estimated based on score complexity)
        score = report_dict['score']
        if score >= 0.9:
            duration = "8 min"
        elif score >= 0.8:
            duration = "10 min"
        elif score >= 0.7:
            duration = "12 min"
        else:
            duration = "15 min"
        
        report_dict['duration'] = duration
        report_dict['score_percentage'] = int(score * 100)
        
        result.append(report_dict)
    
    conn.close()
    return result

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
    tips = conn.execute("SELECT * FROM tips WHERE isDeleted = 0").fetchall()
    conn.close()
    return [dict(t) for t in tips]

def get_viewed_tips_by_parent(parent_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT t.* FROM tips t
        JOIN tip_views v ON t.tip_id = v.tip_id
        WHERE v.parent_id = ?
    """, (parent_id,)).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_tips_with_viewed_status(parent_id):
    """Get all tips with a flag indicating if they've been viewed by the parent"""
    conn = get_db_connection()
    
    all_tips = conn.execute("""
        SELECT t.* FROM tips t 
        WHERE t.isDeleted = 0
        ORDER BY t.tip_id
    """).fetchall()
    
    viewed_tip_ids = conn.execute("""
        SELECT DISTINCT tip_id FROM tip_views 
        WHERE parent_id = ?
    """, (parent_id,)).fetchall()
    
    viewed_ids = {row["tip_id"] for row in viewed_tip_ids}
        
    result = []
    for tip in all_tips:
        tip_dict = dict(tip)
        tip_dict['is_viewed'] = tip['tip_id'] in viewed_ids
        result.append(tip_dict)
    
    conn.close()
    return result

def mark_tip_viewed(parent_id, tip_id):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO tip_views (parent_id, tip_id, viewed_at)
        VALUES (?, ?, datetime('now'))
    """, (parent_id, tip_id))
    conn.commit()
    conn.close()

def get_tips_with_status(parent_id):
    conn = get_db_connection()
    query = """
        SELECT t.*, CASE WHEN tv.id IS NOT NULL THEN 1 ELSE 0 END as viewed
        FROM tips t
        LEFT JOIN tip_views tv ON t.tip_id = tv.tip_id AND tv.parent_id=?
        WHERE t.isDeleted=0
    """
    cur = conn.execute(query, (parent_id,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]    

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


def get_complaints_by_user(user_id):
    """Get all complaints filed by a specific user"""
    conn = get_db_connection()
    complaints = conn.execute("""
        SELECT c.*, 
               u1.username as filed_by_username,
               u2.username as against_username
        FROM complaints c
        LEFT JOIN users u1 ON c.filed_by = u1.id
        LEFT JOIN users u2 ON c.against = u2.id
        WHERE c.filed_by = ? AND c.isDeleted = 0
        ORDER BY c.complaint_id DESC
    """, (user_id,)).fetchall()
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
    
    mentor_id=data.get("mentor_id")
    quiz_title = data.get('title')
    module_id = data.get('module_id')
    questions = data.get('questions', [])

    # Validate structure
    if not isinstance(questions, list):
        raise ValueError(f"'questions' must be a list, got {type(questions).__name__}")

    # Insert quiz
    cursor.execute("INSERT INTO quizzes (module_id,mentor_id, title) VALUES (?, ?,?)", (module_id,mentor_id, quiz_title))
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
    for field in ['username', 'email']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))
    
    # Handle password separately to hash it
    if args.get("password"):
        from werkzeug.security import generate_password_hash
        fields.append("password = ?")
        values.append(generate_password_hash(args.get("password")))

    # Update only if there’s something to update
    if fields:
        values.append(args['user_id'])
        conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()

    conn.close()


# ------------------- ACTIVITY -------------------
def get_student_activity(student_id):
    conn = get_db_connection()
    
    # Get quiz attempts
    quiz_attempts = conn.execute("""
        SELECT * FROM student_quiz_attempts 
        WHERE student_id = ? 
        ORDER BY timestamp DESC
    """, (student_id,)).fetchall()
    
    # Get modules viewed
    modules_viewed = conn.execute("""
        SELECT m.* FROM modules m
        WHERE m.module_id IN (
            SELECT module_id FROM student_progress WHERE student_id = ?
        )
    """, (student_id,)).fetchall()
    
    # Calculate comprehensive stats
    stats = calculate_student_stats(conn, student_id, quiz_attempts, modules_viewed)
    
    conn.close()
    
    return {
        "quiz_attempts": [dict(q) for q in quiz_attempts],
        "modules_viewed": [dict(m) for m in modules_viewed],
        **stats
    }

def calculate_student_stats(conn, student_id, quiz_attempts, modules_viewed):
    """Calculate comprehensive student activity statistics"""
    
    # Get last active time (most recent quiz attempt)
    last_active = "Never"
    if quiz_attempts:
        last_attempt = quiz_attempts[0]
        last_active = format_time_ago(last_attempt['timestamp'])
    
    # Get login count (approximated by number of quiz attempts)
    login_count = len(quiz_attempts)
    
    # Calculate average time spent (estimated based on quiz attempts)
    time_spent = "0 mins/day"
    if quiz_attempts:
        # Estimate 10-15 minutes per quiz attempt
        avg_time_per_attempt = 12  # minutes
        total_attempts = len(quiz_attempts)
        estimated_total_time = total_attempts * avg_time_per_attempt
        time_spent = f"{estimated_total_time} mins total"
    
    # Get last module watched
    last_module = "No modules completed"
    if modules_viewed:
        last_module = f"Module {modules_viewed[0]['module_id']} - {modules_viewed[0]['title']}"
    
    # Get recent badge (based on quiz performance)
    recent_badge = "No badges yet"
    if quiz_attempts:
        recent_scores = [attempt['score'] for attempt in quiz_attempts[:3]]  # Last 3 attempts
        avg_recent_score = sum(recent_scores) / len(recent_scores)
        
        if avg_recent_score >= 0.9:
            recent_badge = "Quiz Master"
        elif avg_recent_score >= 0.8:
            recent_badge = "Cyber Champion"
        elif avg_recent_score >= 0.7:
            recent_badge = "Safe Learner"
        else:
            recent_badge = "Getting Started"
    
    # Get last login (most recent activity)
    last_login = "Never"
    if quiz_attempts:
        last_login = format_date(quiz_attempts[0]['timestamp'])
    
    return {
        "last_active": last_active,
        "login_count": login_count,
        "time_spent": time_spent,
        "last_module": last_module,
        "recent_badge": recent_badge,
        "last_login": last_login
    }

def format_time_ago(timestamp_str):
    """Convert timestamp to 'time ago' format"""
    try:
        from datetime import datetime
        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
        now = datetime.now()
        diff = now - timestamp
        
        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "Just now"
    except:
        return "Recently"

def format_date(timestamp_str):
    """Convert timestamp to readable date format"""
    try:
        from datetime import datetime
        timestamp = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
        return timestamp.strftime('%B %d, %Y')
    except:
        return "Unknown"

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

# Theme Preferences Functions
def get_user_theme(user_id):
    """Get user's theme preference"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise ValueError(f"User with id {user_id} does not exist.")
    
    # Get theme preference, create default if not exists
    preference = cursor.execute(
        "SELECT theme FROM user_preferences WHERE user_id = ?", 
        (user_id,)
    ).fetchone()
    
    if not preference:
        # Create default preference
        cursor.execute(
            "INSERT INTO user_preferences (user_id, theme) VALUES (?, ?)",
            (user_id, 'system')
        )
        conn.commit()
        theme = 'system'
    else:
        theme = preference['theme']
    
    conn.close()
    return theme


def set_user_theme(user_id, theme):
    """Set user's theme preference"""
    if theme not in ['system', 'light', 'dark']:
        raise ValueError("Theme must be 'system', 'light', or 'dark'")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise ValueError(f"User with id {user_id} does not exist.")
    
    # Update or insert theme preference
    cursor.execute("""
        INSERT OR REPLACE INTO user_preferences (user_id, theme, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
    """, (user_id, theme))
    
    conn.commit()
    conn.close()


def get_user_notification_preferences(user_id):
    """Get user's notification preferences"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise ValueError(f"User with id {user_id} does not exist.")
    
    # Get notification preferences, create default if not exists
    preference = cursor.execute(
        "SELECT notification_email, notification_push, notification_sms, frequency FROM user_preferences WHERE user_id = ?", 
        (user_id,)
    ).fetchone()
    
    if not preference:
        # Create default preference
        cursor.execute(
            "INSERT INTO user_preferences (user_id, notification_email, notification_push, notification_sms, frequency) VALUES (?, ?, ?, ?, ?)",
            (user_id, 1, 1, 0, 'immediate')
        )
        conn.commit()
        email_enabled = 1
        push_enabled = 1
        sms_enabled = 0
        frequency = 'immediate'
    else:
        email_enabled = preference['notification_email']
        push_enabled = preference['notification_push']
        sms_enabled = preference['notification_sms']
        frequency = preference['frequency']
    
    conn.close()
    return {
        'notification_email': bool(email_enabled),
        'notification_push': bool(push_enabled),
        'notification_sms': bool(sms_enabled),
        'frequency': frequency
    }


def set_user_notification_preferences(user_id, email_enabled, push_enabled, sms_enabled=False, frequency='immediate'):
    """Set user's notification preferences"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise ValueError(f"User with id {user_id} does not exist.")
    
    # Validate frequency
    if frequency not in ['immediate', 'daily', 'weekly']:
        raise ValueError("Frequency must be 'immediate', 'daily', or 'weekly'")
    
    # Update or insert notification preferences
    cursor.execute("""
        INSERT OR REPLACE INTO user_preferences 
        (user_id, notification_email, notification_push, notification_sms, frequency, updated_at) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (user_id, 1 if email_enabled else 0, 1 if push_enabled else 0, 1 if sms_enabled else 0, frequency))
    
    conn.commit()
    conn.close()


# Parent-Child Management Functions
def get_children_for_parent(parent_id):
    """Get all children linked to a parent"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists and is a parent
    user = cursor.execute("""
        SELECT u.id, u.username, u.email, u.role 
        FROM users u 
        JOIN parents p ON u.id = p.user_id 
        WHERE u.id = ?
    """, (parent_id,)).fetchone()
    
    if not user:
        raise ValueError(f"User {parent_id} must be a parent.")
    
    # Get linked children
    children = cursor.execute("""
        SELECT u.id, u.username, u.email, u.role, s.age
        FROM users u
        JOIN students s ON u.id = s.user_id
        JOIN parent_student ps ON s.user_id = ps.student_id
        WHERE ps.parent_id = ?
    """, (parent_id,)).fetchall()
    
    conn.close()
    return [dict(child) for child in children]


def get_available_students_for_parent(parent_id):
    """Get all students that can be linked to a parent (not already linked)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists and is a parent
    user = cursor.execute("""
        SELECT u.id, u.username, u.email, u.role 
        FROM users u 
        JOIN parents p ON u.id = p.user_id 
        WHERE u.id = ?
    """, (parent_id,)).fetchone()
    
    if not user:
        raise ValueError(f"User {parent_id} must be a parent.")
    
    # Get all students that are not already linked to this parent
    students = cursor.execute("""
        SELECT u.id, u.username, u.email, u.role, s.age
        FROM users u
        JOIN students s ON u.id = s.user_id
        WHERE u.role = 'student' 
        AND u.id NOT IN (
            SELECT ps.student_id 
            FROM parent_student ps 
            WHERE ps.parent_id = ?
        )
        ORDER BY u.username
    """, (parent_id,)).fetchall()
    
    conn.close()
    return [dict(student) for student in students]


def link_child_to_parent(parent_id, student_id):
    """Link a student to a parent"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if parent exists
        parent = cursor.execute("""
            SELECT u.id FROM users u 
            JOIN parents p ON u.id = p.user_id 
            WHERE u.id = ?
        """, (parent_id,)).fetchone()
        
        if not parent:
            raise ValueError(f"User {parent_id} must be a parent.")
        
        # Check if student exists
        student = cursor.execute("""
            SELECT u.id FROM users u 
            JOIN students s ON u.id = s.user_id 
            WHERE u.id = ?
        """, (student_id,)).fetchone()
        
        if not student:
            raise ValueError(f"User {student_id} must be a student.")
        
        # Check if link already exists
        existing = cursor.execute("""
            SELECT parent_id FROM parent_student 
            WHERE parent_id = ? AND student_id = ?
        """, (parent_id, student_id)).fetchone()
        
        if existing:
            return False  # Already linked
        
        # Create link
        cursor.execute("""
            INSERT INTO parent_student (parent_id, student_id) 
            VALUES (?, ?)
        """, (parent_id, student_id))
        
        conn.commit()
        return True
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


def unlink_child_from_parent(parent_id, student_id):
    """Unlink a student from a parent"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if parent exists
        parent = cursor.execute("""
            SELECT u.id FROM users u 
            JOIN parents p ON u.id = p.user_id 
            WHERE u.id = ?
        """, (parent_id,)).fetchone()
        
        if not parent:
            raise ValueError(f"User {parent_id} must be a parent.")
        
        # Check if student exists
        student = cursor.execute("""
            SELECT u.id FROM users u 
            JOIN students s ON u.id = s.user_id 
            WHERE u.id = ?
        """, (student_id,)).fetchone()
        
        if not student:
            raise ValueError(f"User {student_id} must be a student.")
        
        # Remove link
        cursor.execute("""
            DELETE FROM parent_student 
            WHERE parent_id = ? AND student_id = ?
        """, (parent_id, student_id))
        
        conn.commit()
        return cursor.rowcount > 0
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


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
def get_parent_children_activity(parent_id):
    """Get comprehensive activity data for all children linked to a parent"""
    conn = get_db_connection()
    
    # Get all children linked to this parent
    children = conn.execute("""
        SELECT s.id as student_id, s.username, s.email
        FROM users s
        JOIN parent_student ps ON s.id = ps.student_id
        WHERE ps.parent_id = ?
        ORDER BY s.username
    """, (parent_id,)).fetchall()
    
    # Get activity data for each child
    children_activity = []
    for child in children:
        child_id = child['student_id']
        
        # Get quiz attempts for this child
        quiz_attempts = conn.execute("""
            SELECT * FROM student_quiz_attempts 
            WHERE student_id = ? 
            ORDER BY timestamp DESC
        """, (child_id,)).fetchall()
        
        # Get modules viewed by this child
        modules_viewed = conn.execute("""
            SELECT m.* FROM modules m
            WHERE m.module_id IN (
                SELECT module_id FROM student_progress WHERE student_id = ?
            )
        """, (child_id,)).fetchall()
        
        # Calculate stats for this child
        stats = calculate_student_stats(conn, child_id, quiz_attempts, modules_viewed)
        
        children_activity.append({
            "student_id": child_id,
            "username": child['username'],
            "email": child['email'],
            "quiz_attempts": [dict(q) for q in quiz_attempts],
            "modules_viewed": [dict(m) for m in modules_viewed],
            **stats
        })
    
    conn.close()
    return children_activity

def get_parent_dashboard_data(parent_id):
    """Get comprehensive dashboard data for a parent in a single query"""
    conn = get_db_connection()
    
    # Get all children linked to this parent
    children = conn.execute("""
        SELECT s.id as student_id, s.username, s.email
        FROM users s
        JOIN parent_student ps ON s.id = ps.student_id
        WHERE ps.parent_id = ?
        ORDER BY s.username
    """, (parent_id,)).fetchall()
    
    # Get all quiz attempts for all children in one query
    if children:
        child_ids = [child['student_id'] for child in children]
        placeholders = ','.join(['?' for _ in child_ids])
        all_attempts = conn.execute(f"""
            SELECT sqa.*, q.title as quiz_title, m.title as module_title
            FROM student_quiz_attempts sqa
            LEFT JOIN quizzes q ON sqa.quiz_id = q.quiz_id
            LEFT JOIN modules m ON q.module_id = m.module_id
            WHERE sqa.student_id IN ({placeholders})
            ORDER BY sqa.timestamp DESC
        """, child_ids).fetchall()
    else:
        all_attempts = []
    
    # Get viewed tips for parent
    viewed_tips = conn.execute("""
        SELECT t.* FROM tips t
        JOIN tip_views v ON t.tip_id = v.tip_id
        WHERE v.parent_id = ?
    """, (parent_id,)).fetchall()
    
    # Get most recent activity from any child
    most_recent_activity = None
    if all_attempts:
        most_recent_attempt = all_attempts[0]
        most_recent_activity = {
            "last_active": format_time_ago(most_recent_attempt['timestamp']),
            "login_count": len(all_attempts),
            "time_spent": f"{len(all_attempts) * 12} mins total",
            "last_login": format_date(most_recent_attempt['timestamp'])
        }
    
    # Calculate quiz stats
    module_scores = {}
    for attempt in all_attempts:
        module_id = attempt['quiz_id']
        if module_id not in module_scores:
            module_scores[module_id] = []
        module_scores[module_id].append(attempt['score'])
    
    quiz_stats = []
    for module_id, scores in module_scores.items():
        avg_score = sum(scores) / len(scores)
        quiz_stats.append({
            "module": f"Module {module_id}",
            "score": round(avg_score * 100)
        })
    
    # Calculate tips stats
    category_counts = {}
    for tip in viewed_tips:
        category = tip['category'] or 'other'
        category_counts[category] = category_counts.get(category, 0) + 1
    
    tips_stats = []
    for category, count in category_counts.items():
        tips_stats.append({
            "topic": category.replace('_', ' ').title(),
            "count": count
        })
    
    conn.close()
    
    return {
        "linked_children_count": len(children),
        "linked_children": [dict(child) for child in children],
        "quiz_stats": quiz_stats,
        "tips_stats": tips_stats,
        "most_recent_activity": most_recent_activity,
        "total_quiz_attempts": len(all_attempts),
        "total_viewed_tips": len(viewed_tips)
    }

#--------------MENTOR PROFILE-------------------------------------#

def update_mentor_profile_details(args):
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
    for field in ['username', 'email']:
        if args.get(field):
            fields.append(f"{field} = ?")
            values.append(args.get(field))
    


    # Update only if there’s something to update
    if fields:
        values.append(args['user_id'])
        conn.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = ?", values)
        conn.commit()
        
        
    #  Prepare additional update fields
        
    fields_2 = []
    values_2 = []
    for field_2 in ['expertise', 'experience_years']:
        if args.get(field_2):
            fields_2.append(f"{field_2} = ?")
            values_2.append(args.get(field_2))

            
    # Update only if there’s something to update
    if fields_2:
        values_2.append(args['user_id'])
        conn.execute(f"UPDATE mentors SET {', '.join(fields_2)} WHERE user_id = ?", values_2)
        conn.commit()
        
    conn.close()
    
def get_mentor_videos(user_id):
    conn = get_db_connection()
    mentor_videos = conn.execute(" SELECT * FROM videos  WHERE mentor_id =? AND isDeleted = 0",(user_id,)).fetchall()
    print(type(mentor_videos))   
    mentor_video_list=[]
    for video in mentor_videos:
        modified_video_url= f"http://127.0.0.1:5050{video['video_url']}"
        if video["isApproved"]==0:
            likes=0
            views=0
            status="Approval Pending"
        if video["isApproved"]==1:
            likes=video["likes"]
            views=video["views"]
            status="Approved"
            
        #modified_video_url="http://127.0.0.1:5050/"+str(video["video_url"])
        data={
        "video_id":video["video_id"],
        "title":video["title"],
        "description":video["description"],
        "uploaded_by":video["uploaded_by"],
        "mentor_id":video["mentor_id"],
        "module_id":video["module_id"],
        "views":views,
        "likes":likes,
        "video_url":modified_video_url,
        "isDeleted":video["isDeleted"],
        "isApproved":status,
        "timestamp":video["timestamp"]
        }
        mentor_video_list.append(data)
    print(mentor_video_list)
        
    conn.close()
    return mentor_video_list

def get_mentor_tips(user_id):
    conn = get_db_connection()
    print("get_mentor_tips")
    mentor_tips = conn.execute("SELECT * FROM tips WHERE mentor_id=? AND isDeleted = 0",(user_id,)).fetchall()
    print(mentor_tips)
    conn.close()
    return mentor_tips

def upload_mentor_tips(title,content,mentor_id,category,source_url):
    conn = get_db_connection()
    cursor = conn.cursor()


    cursor.execute("""
        INSERT INTO tips (title,content,mentor_id,category,source_url)
        VALUES (?, ?, ?, ?, ?)
    """, (title,content,mentor_id,category,source_url))

    conn.commit()
    conn.close()


# ---------------- USER PREFERENCES ---------------- #
def get_user_preferences(user_id):
    conn = get_db_connection()
    cur = conn.execute("SELECT * FROM user_preferences WHERE user_id=?", (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

def update_user_preferences(user_id, prefs):
    conn = get_db_connection()
    conn.execute("""
        UPDATE user_preferences
        SET theme=?, notification_email=?, notification_push=?,
            notification_sms=?, frequency=?, updated_at=CURRENT_TIMESTAMP
        WHERE user_id=?
    """, (
        prefs.get("theme"),
        prefs.get("notification_email"),
        prefs.get("notification_push"),
        prefs.get("notification_sms"),
        prefs.get("frequency"),
        user_id
    ))
    conn.commit()
    conn.close()

# ---------------- PARENTS & CHILDREN ---------------- #
def get_children_by_parent(parent_id):
    conn = get_db_connection()
    query = """
        SELECT s.* FROM students s
        JOIN parents p ON p.user_id=?
    """
    cur = conn.execute(query, (parent_id,))
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ---------------- PROFILE ---------------- #
def get_user_profile(user_id):
    conn = get_db_connection()
    cur = conn.execute("""
        SELECT u.id, u.username, u.email, u.role,
               up.theme, up.notification_email, up.notification_push, up.notification_sms, up.frequency
        FROM users u
        LEFT JOIN user_preferences up ON u.id = up.user_id
        WHERE u.id=?
    """, (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None

# ---------------- DASHBOARD (Parent) ---------------- #
def get_parent_dashboard(parent_id):
    conn = get_db_connection()
    data = {}

    # children
    cur = conn.execute("SELECT * FROM students")
    data["children"] = [dict(r) for r in cur.fetchall()]

    # notifications
    cur = conn.execute("SELECT * FROM notifications WHERE user_id=?", (parent_id,))
    data["notifications"] = [dict(r) for r in cur.fetchall()]

    # tips viewed
    cur = conn.execute("SELECT COUNT(*) as viewed_count FROM tip_views WHERE parent_id=?", (parent_id,))
    data["tips_viewed"] = cur.fetchone()["viewed_count"]

    conn.close()
    return data

# ======================
# Dashboard helper functions
# ======================

def get_linked_children(parent_id):
    rows = safe_execute(
        "SELECT id, username, email FROM users WHERE parent_id = ?",
        (parent_id,)
    )
    return rows


def get_quiz_stats_for_parent(parent_id):
    rows = safe_execute("""
        SELECT q.id as quiz_id, q.title, COUNT(a.id) as attempts
        FROM quizzes q
        JOIN student_quiz_attempts a ON q.id = a.quiz_id
        JOIN users u ON a.student_id = u.id
        WHERE u.parent_id = ?
        GROUP BY q.id, q.title
    """, (parent_id,))
    return rows


def get_tips_stats_for_parent(parent_id):
    rows = safe_execute("""
        SELECT t.id as tip_id, t.title, COUNT(v.id) as views
        FROM tips t
        LEFT JOIN tip_views v ON t.id = v.tip_id
        JOIN users u ON v.student_id = u.id
        WHERE u.parent_id = ?
        GROUP BY t.id, t.title
    """, (parent_id,))
    return rows


def get_recent_activity_for_parent(parent_id):
    row = safe_execute("""
        SELECT a.activity_type, a.description, a.timestamp
        FROM activity a
        JOIN users u ON a.student_id = u.id
        WHERE u.parent_id = ?
        ORDER BY a.timestamp DESC
        LIMIT 1
    """, (parent_id,), fetchone=True)
    return dict(row) if row else {"message": "No recent activity"}


def get_total_viewed_tips(parent_id):
    row = safe_execute("""
        SELECT COUNT(v.id) as total_views
        FROM tip_views v
        JOIN users u ON v.student_id = u.id
        WHERE u.parent_id = ?
    """, (parent_id,), fetchone=True)
    return row["total_views"] if row else 0

# models.py
from db import get_db_connection

def get_linked_children(parent_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, username FROM users WHERE parent_id = ?", (parent_id,))
    children = [{"id": row["id"], "username": row["username"]} for row in cur.fetchall()]
    conn.close()
    return children

def get_quiz_stats(parent_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT q.module_id AS module, AVG(a.score) AS score
        FROM student_quiz_attempts a
        JOIN quizzes q ON a.quiz_id = q.id
        JOIN users s ON a.student_id = s.id
        WHERE s.parent_id = ?
        GROUP BY q.module_id
        ORDER BY q.module_id
    """, (parent_id,))
    quiz_stats = [{"module": str(row["module"]), "score": round(row["score"])} for row in cur.fetchall()]
    conn.close()
    return quiz_stats

def get_tips_stats(parent_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT t.topic, COUNT(v.id) AS count
        FROM tip_views v
        JOIN tips t ON v.tip_id = t.id
        JOIN users s ON v.student_id = s.id
        WHERE s.parent_id = ?
        GROUP BY t.topic
    """, (parent_id,))
    tips_stats = [{"topic": row["topic"], "count": row["count"]} for row in cur.fetchall()]
    conn.close()
    return tips_stats

def get_recent_activity(parent_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT s.username, MAX(a.timestamp) AS last_active
        FROM activity_logs a
        JOIN users s ON a.student_id = s.id
        WHERE s.parent_id = ?
    """, (parent_id,))
    row = cur.fetchone()
    conn.close()
    return {"username": row["username"] if row else None, "last_active": row["last_active"] if row else None}
