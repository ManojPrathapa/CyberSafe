import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "module_tester"
PASSWORD = "test123"
EMAIL = "module_tester@example.com"

print("Registering user...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"  # Can be student, mentor, or anything since no role check
})
print("Register status:", res.status_code, res.json())

print("\nLogging in to get JWT token...")
res = requests.post(f"{BASE_URL}/login", json={
    "username": USERNAME,
    "password": PASSWORD
})
if res.status_code != 200:
    print("Login failed:", res.status_code, res.text)
    exit()

token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("JWT Token:", token[:50], "...")

# 1️⃣ Upload a module
print("\nUploading module...")
res = requests.post(f"{BASE_URL}/modules/upload", json={
    "mentor_id": 1,
    "title": "Cyber Safety Basics",
    "description": "Learn how to stay safe online.",
    "video_url": "https://example.com/video",
    "resource_link": "https://example.com/resources"
}, headers=headers)
print("Upload module:", res.status_code, res.json())

# 2️⃣ Get module list
print("\nFetching module list...")
res = requests.get(f"{BASE_URL}/modules", headers=headers)
print("Module list:", res.status_code, res.json())

# 3️⃣ Try deleting the first module if available
if res.status_code == 200 and len(res.json()) > 0:
    module_id = res.json()[0].get("id") or res.json()[0].get("module_id") or 1
    print(f"\nDeleting module {module_id}...")
    res = requests.delete(f"{BASE_URL}/modules/delete/{module_id}", headers=headers)
    print("Delete module:", res.status_code, res.json())
