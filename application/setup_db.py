import sqlite3

conn = sqlite3.connect("cybersafe.db")
cursor = conn.cursor()

cursor.executescript("""
-- USERS
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'parent', 'mentor', 'admin', 'support')),
    is_active BOOLEAN DEFAULT 1
);

-- STUDENTS
CREATE TABLE IF NOT EXISTS students (
    user_id INTEGER PRIMARY KEY,
    age INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- PARENTS
CREATE TABLE IF NOT EXISTS parents (
    user_id INTEGER PRIMARY KEY,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- MENTORS
CREATE TABLE IF NOT EXISTS mentors (
    user_id INTEGER PRIMARY KEY,
    expertise TEXT,
    experience_years INTEGER,
    is_approved BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- MODULES
CREATE TABLE IF NOT EXISTS modules (
    module_id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
);

-- VIDEOS
CREATE TABLE IF NOT EXISTS videos (
    video_id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT,
    uploaded_by INTEGER,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    module_id INTEGER,
    FOREIGN KEY(uploaded_by) REFERENCES mentors(user_id),
    FOREIGN KEY(module_id) REFERENCES modules(module_id)
);

-- QUIZZES
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id INTEGER PRIMARY KEY,
    module_id INTEGER,
    FOREIGN KEY(module_id) REFERENCES modules(module_id)
);

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
    question_id INTEGER PRIMARY KEY,
    quiz_id INTEGER,
    text TEXT,
    explanation TEXT,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(quiz_id)
);

-- OPTIONS
CREATE TABLE IF NOT EXISTS options (
    option_id INTEGER PRIMARY KEY,
    question_id INTEGER,
    text TEXT,
    is_correct BOOLEAN,
    FOREIGN KEY(question_id) REFERENCES questions(question_id)
);

-- STUDENT QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS student_quiz_attempts (
    attempt_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    quiz_id INTEGER,
    answers TEXT,  -- JSON string: {"question_id": option_id}
    score REAL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(user_id),
    FOREIGN KEY(quiz_id) REFERENCES quizzes(quiz_id)
);

-- DOUBTS
CREATE TABLE IF NOT EXISTS doubts (
    doubt_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    mentor_id INTEGER,
    module_id INTEGER,
    question TEXT,
    answer TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(user_id),
    FOREIGN KEY(mentor_id) REFERENCES mentors(user_id),
    FOREIGN KEY(module_id) REFERENCES modules(module_id)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    message TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- COMPLAINTS
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INTEGER PRIMARY KEY,
    filed_by TEXT,
    against TEXT,
    description TEXT,
    status TEXT
);

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
    report_id INTEGER PRIMARY KEY,
    student_id INTEGER,
    quiz_id INTEGER,
    score REAL,
    duration TEXT,
    FOREIGN KEY(student_id) REFERENCES students(user_id),
    FOREIGN KEY(quiz_id) REFERENCES quizzes(quiz_id)
);

-- TIPS
CREATE TABLE IF NOT EXISTS tips (
    tip_id INTEGER PRIMARY KEY,
    title TEXT,
    content TEXT,
    category TEXT,
    source_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- TIP VIEWS
CREATE TABLE IF NOT EXISTS tip_views (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER,
    tip_id INTEGER,
    viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(parent_id) REFERENCES parents(user_id),
    FOREIGN KEY(tip_id) REFERENCES tips(tip_id)
);

-- PARENT-STUDENT RELATIONSHIP
CREATE TABLE IF NOT EXISTS parent_student (
    parent_id INTEGER,
    student_id INTEGER,
    PRIMARY KEY (parent_id, student_id),
    FOREIGN KEY(parent_id) REFERENCES parents(user_id),
    FOREIGN KEY(student_id) REFERENCES students(user_id)
);
""")

conn.commit()
conn.close()
print("CYBERSAFE database schema created successfully.")
