# models.py
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

# models.py (append)

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

def get_notifications(user_id):
    conn = get_db_connection()
    notifs = conn.execute("""
        SELECT * FROM notifications WHERE user_id = ?
    """, (user_id,)).fetchall()
    conn.close()
    return notifs

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