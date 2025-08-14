import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "studecdsvsfb25nt1"
PASSWORD = "pasadsas123"
EMAIL = "studdasase25nt1@example.com"

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
user_id = data["user"]["id"]
print("JWT Token:", token)

headers = {"Authorization": f"Bearer {token}"}

# Step 3: Test GET Profile
print("\nFetching profile...")
res = requests.get(f"{BASE_URL}/profile/{user_id}", headers=headers)
print("Profile GET status:", res.status_code)
print("Response:", res.json())

# Step 4: Test POST Edit Profile
print("\nUpdating profile...")
res = requests.post(f"{BASE_URL}/profile/edit", json={
    "user_id": user_id,
    "email": "updated_email@example.com"
}, headers=headers)
print("Profile Edit status:", res.status_code)
print("Response:", res.json())
