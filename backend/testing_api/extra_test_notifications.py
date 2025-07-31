import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "studentkhugygjuy1"
PASSWORD = "studenjguytpass"
EMAIL = "studengjugyt1@example.com"

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
user_id = data["user"]["id"]
print("JWT Token:", token)

# Step 3: Access Notification Endpoint with JWT
print("\nFetching notifications...")
headers = {"Authorization": f"Bearer {token}"}

res = requests.get(f"{BASE_URL}/notifications/{user_id}", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())
