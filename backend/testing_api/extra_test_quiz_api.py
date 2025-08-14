import requests

BASE_URL = "http://127.0.0.1:5050/api"

# 1. Register a student
print("\nRegistering student...")
student_data = {
    "username": "student155",
    "email": "student155@example.com",
    "password": "password123",
    "role": "student"
}
res = requests.post(f"{BASE_URL}/register", json=student_data)
print("Register:", res.status_code, res.json())

# 2. Login student
print("\nLogging in student...")
login_data = {
    "username": "student155",
    "password": "password123"
}
res = requests.post(f"{BASE_URL}/login", json=login_data)
login_json = res.json()
print("Login:", res.status_code, login_json)

token = login_json.get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 3. Create a quiz
print("\nCreating a quiz...")
quiz_payload = {
    "title": "Cyber Safety Quiz",
    "module_id": 1,
    "questions": [
        {
            "text": "What is phishing?",
            "explanation": "Phishing is a type of online scam.",
            "options": [
                {"text": "A scam email", "is_correct": True},
                {"text": "A computer game", "is_correct": False}
            ]
        },
        {
            "text": "Which is a strong password?",
            "options": [
                {"text": "123456", "is_correct": False},
                {"text": "H@ckM3!2025", "is_correct": True}
            ]
        }
    ]
}

res = requests.post(f"{BASE_URL}/quiz/create", json=quiz_payload, headers=headers)
try:
    print("Create Quiz:", res.status_code, res.json())
except Exception:
    print("Create Quiz Raw Response:", res.status_code, res.text)

# 4. Fetch quiz
print("\nFetching quiz with ID 1...")
res = requests.get(f"{BASE_URL}/quiz/1", headers=headers)
try:
    print("Fetch Quiz:", res.status_code, res.json())
except Exception:
    print("Fetch Quiz Raw Response:", res.status_code, res.text)

# 5. Submit quiz attempt
print("\nSubmitting quiz attempt...")
submit_payload = {
    "quiz_id": 1,
    "student_id": 1,
    "answers": {
        "1": 1,  # question_id : selected_option_id
        "2": 4
    }
}
res = requests.post(f"{BASE_URL}/quiz/submit", json=submit_payload, headers=headers)
try:
    print("Submit Quiz:", res.status_code, res.json())
except Exception:
    print("Submit Quiz Raw Response:", res.status_code, res.text)
