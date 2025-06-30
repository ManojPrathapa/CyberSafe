# app.py
from flask import Flask, request, jsonify
from models import create_user, get_user_by_username

app = Flask(__name__)

@app.route('/')
def home():
    return "CYBERSAFE API is up and running 🚀"

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    role = data['role']

    if get_user_by_username(username):
        return jsonify({'error': 'Username already exists'}), 400

    create_user(username, email, password, role)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = get_user_by_username(username)
    if user and user['password'] == password:
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'role': user['role']
            }
        })
    return jsonify({'error': 'Invalid username or password'}), 401

# app.py (append at the bottom)

from models import (
    get_all_modules,
    get_quiz_with_questions,
    evaluate_quiz,
    ask_doubt,
    get_doubts_for_mentor,
    get_notifications
)

@app.route('/api/modules', methods=['GET'])
def modules():
    modules = get_all_modules()
    return jsonify([dict(m) for m in modules])

@app.route('/api/quiz/<int:quiz_id>', methods=['GET'])
def view_quiz(quiz_id):
    quiz = get_quiz_with_questions(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    return jsonify(quiz)

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    quiz_id = data['quiz_id']
    answers = data['answers']  # {question_id: selected_option_id}

    result = evaluate_quiz(quiz_id, answers)
    return jsonify(result)

@app.route('/api/doubt', methods=['POST'])
def post_doubt():
    data = request.get_json()
    ask_doubt(
        student_id=data['student_id'],
        mentor_id=data['mentor_id'],
        module_id=data['module_id'],
        question=data['question']
    )
    return jsonify({"message": "Doubt submitted successfully."})

@app.route('/api/doubts/<int:mentor_id>', methods=['GET'])
def get_doubts(mentor_id):
    doubts = get_doubts_for_mentor(mentor_id)
    return jsonify([dict(d) for d in doubts])

@app.route('/api/notifications/<int:user_id>', methods=['GET'])
def notifications(user_id):
    notifs = get_notifications(user_id)
    return jsonify([dict(n) for n in notifs])


if __name__ == '__main__':
    app.run(debug=True)
