import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "student12245"
PASSWORD = "pass1231"
EMAIL = "student123@example.com"

# Step 1: Try registering a student (ignore if already exists)
print("Registering student...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})

if res.status_code in (200, 201, 400):
    print("Register response:", res.json())
else:
    print("Unexpected register status:", res.status_code, res.text)

# Step 2: Login to get JWT token
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
student_id = data["user"]["id"]
print("JWT Token:", token)

# Step 3: Access the protected StudentActivityAPI
print("\nAccessing /api/activity/<student_id> endpoint...")
headers = {"Authorization": f"Bearer {token}"}
res = requests.get(f"{BASE_URL}/activity/{student_id}", headers=headers)

print("Status:", res.status_code)
try:
    print("Response:", res.json())
except:
    print("Response (raw):", res.text)


    
