import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "studenfew45t1"
PASSWORD = "pass12sdesa3"
EMAIL = "studensadwwt1@example.com"

# Step 1: Register a student user
print("Registering student...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login to get JWT token
print("\nLogging in...")
res = requests.post(f"{BASE_URL}/login", json={
    "username": USERNAME,
    "password": PASSWORD
})
if res.status_code != 200:
    print("Login failed:", res.status_code, res.text)
    exit()

data = res.json()
token = data["access_token"]
print("JWT Token:", token)

headers = {"Authorization": f"Bearer {token}"}

# Step 3: Ask a doubt
print("\nAsking a doubt...")
res = requests.post(f"{BASE_URL}/doubt", headers=headers, json={
    "student_id": 1,
    "mentor_id": 1,
    "module_id": 1,
    "question": "What is phishing?"
})
print("Ask Doubt Status:", res.status_code, res.json())

# Step 4: Fetch mentor doubts
print("\nFetching mentor doubts...")
res = requests.get(f"{BASE_URL}/doubts/1", headers=headers)
print("Mentor Doubts Status:", res.status_code, res.json())

# Step 5: Reply to a doubt (assuming doubt_id=1 exists)
print("\nReplying to doubt...")
res = requests.post(f"{BASE_URL}/doubt/reply", headers=headers, json={
    "doubt_id": 1,
    "answer": "Phishing is a scam to steal information."
})
print("Reply Status:", res.status_code, res.json())

# Step 6: Delete a doubt (assuming doubt_id=1 exists)
print("\nDeleting doubt...")
res = requests.delete(f"{BASE_URL}/doubt/delete/1", headers=headers)
print("Delete Status:", res.status_code, res.json())
