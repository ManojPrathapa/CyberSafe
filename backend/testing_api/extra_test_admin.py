import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "admin12"
PASSWORD = "adminpass2"
EMAIL = "admin12@example.com"

# Step 1: Register Admin User
print("Registering admin...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "admin"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login as Admin to get JWT Token
print("\nLogging in as admin...")
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

# Step 3: Test Admin Endpoints
headers = {"Authorization": f"Bearer {token}"}

endpoints = [
    "/admin/users",
    "/admin/trainers/pending",
    "/admin/contents/pending",
    "/admin/reports/download/users",
    "/admin/reports/download/summary"
]

print("\nTesting Admin Endpoints:")
for ep in endpoints:
    url = f"{BASE_URL}{ep}"
    res = requests.get(url, headers=headers)
    print(f"\n{ep} -> {res.status_code}")
    
    # Try to parse JSON if possible
    try:
        print(res.json())
    except Exception:
        print("Non-JSON response (possibly file download):", res.text[:200])

