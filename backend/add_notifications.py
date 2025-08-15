import sqlite3
from datetime import datetime, timedelta

def get_db_connection():
    conn = sqlite3.connect("cybersafe.db")
    conn.row_factory = sqlite3.Row
    return conn

def add_sample_notifications():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get parent1 user ID
    parent_id = cursor.execute("SELECT id FROM users WHERE username = 'parent1'").fetchone()
    if not parent_id:
        print("Parent1 user not found!")
        return
    
    parent_id = parent_id[0]
    
    # Sample notifications for parent1
    notifications = [
        {
            "user_id": parent_id,
            "type": "alert",
            "message": "🛡️ New cybersecurity tip added: 'How to spot phishing emails'",
            "timestamp": datetime.now() - timedelta(minutes=5)
        },
        {
            "user_id": parent_id,
            "type": "quiz",
            "message": "📝 Your child completed the Cyber Hygiene quiz with 85% score!",
            "timestamp": datetime.now() - timedelta(hours=1)
        },
        {
            "user_id": parent_id,
            "type": "doubt",
            "message": "❓ Your child asked a question about password security",
            "timestamp": datetime.now() - timedelta(hours=2)
        },
        {
            "user_id": parent_id,
            "type": "admin",
            "message": "👨‍💼 New module 'Social Media Safety' is now available",
            "timestamp": datetime.now() - timedelta(days=1)
        },
        {
            "user_id": parent_id,
            "type": "mentor",
            "message": "👨‍🏫 Mentor replied to your child's question about online privacy",
            "timestamp": datetime.now() - timedelta(days=2)
        }
    ]
    
    # Insert notifications
    for notification in notifications:
        cursor.execute("""
            INSERT INTO notifications (user_id, type, message, timestamp, isRead, isDeleted)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            notification["user_id"],
            notification["type"],
            notification["message"],
            notification["timestamp"],
            0,  # isRead = false
            0   # isDeleted = false
        ))
    
    conn.commit()
    print(f"Added {len(notifications)} sample notifications for parent1")
    
    # Also add some notifications for student1
    student_id = cursor.execute("SELECT id FROM users WHERE username = 'student1'").fetchone()
    if student_id:
        student_id = student_id[0]
        
        student_notifications = [
            {
                "user_id": student_id,
                "type": "quiz",
                "message": "📝 New quiz available in Cyber Hygiene module",
                "timestamp": datetime.now() - timedelta(hours=3)
            },
            {
                "user_id": student_id,
                "type": "mentor",
                "message": "👨‍🏫 Mentor answered your question about phishing",
                "timestamp": datetime.now() - timedelta(days=1)
            },
            {
                "user_id": student_id,
                "type": "alert",
                "message": "🚨 Reminder: Complete Module 5 by Friday",
                "timestamp": datetime.now() - timedelta(days=2)
            }
        ]
        
        for notification in student_notifications:
            cursor.execute("""
                INSERT INTO notifications (user_id, type, message, timestamp, isRead, isDeleted)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                notification["user_id"],
                notification["type"],
                notification["message"],
                notification["timestamp"],
                0,  # isRead = false
                0   # isDeleted = false
            ))
        
        conn.commit()
        print(f"Added {len(student_notifications)} sample notifications for student1")
    
    conn.close()

if __name__ == "__main__":
    add_sample_notifications() 