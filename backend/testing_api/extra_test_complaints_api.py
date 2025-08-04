import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "student1w2w2w"
PASSWORD = "studentpass2w2"
EMAIL = "studenw222t1@example.com"

# Step 1: Register Student User
print("Registering student user...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print("Register:", res.status_code, res.json())

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
headers = {"Authorization": f"Bearer {token}"}
print("JWT Token:", token[:50] + "...")

# Step 3: File a Complaint
print("\nFiling a complaint...")
res = requests.post(f"{BASE_URL}/complaints/file", headers=headers, json={
    "filed_by": 1,
    "against": 2,
    "description": "This is a test complaint"
})
print("File Complaint:", res.status_code, res.json())

# Step 4: Get All Complaints
print("\nFetching all complaints...")
res = requests.get(f"{BASE_URL}/complaints", headers=headers)
print("Complaints List:", res.status_code, res.json())

# Step 5: Resolve Complaint (assuming ID=1)
print("\nResolving complaint 1...")
res = requests.post(f"{BASE_URL}/complaints/resolve", headers=headers, json={
    "complaint_id": 1
})
print("Resolve Complaint:", res.status_code, res.json())

# Step 6: Delete Complaint (soft delete)
print("\nDeleting complaint 1...")
res = requests.delete(f"{BASE_URL}/complaints/delete/1", headers=headers)
print("Delete Complaint:", res.status_code, res.json())
