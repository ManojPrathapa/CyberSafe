import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "studeadssant1"
PASSWORD = "studeadasntpass"
EMAIL = "studeadasnt1@example.com"

# Step 1: Register Student
print("Registering student...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login to get JWT Token
print("\nLogging in as student...")
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

# Step 3: Test Student Report API (replace student_id=1 with actual id)
student_id = 1
print(f"\nFetching reports for student_id={student_id}...")
res = requests.get(f"{BASE_URL}/reports/{student_id}", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())

# Step 4: Test Delete Report API (replace report_id=1 with actual id to test)
report_id = 1
print(f"\nDeleting report_id={report_id}...")
res = requests.delete(f"{BASE_URL}/reports/delete/{report_id}", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())
