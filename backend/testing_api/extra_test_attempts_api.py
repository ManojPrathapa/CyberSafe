import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "student12278"
PASSWORD = "studentp233ass"
EMAIL = "student1433@example.com"

STUDENT_ID = 1  # Change if your DB uses different IDs

# Step 1: Register Student User
print("Registering student...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login as Student to get JWT Token
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

# Step 3: Access Student Attempts Endpoint
headers = {"Authorization": f"Bearer {token}"}
url = f"{BASE_URL}/student/{STUDENT_ID}/attempts"

print("\nFetching student attempts...")
res = requests.get(url, headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())
