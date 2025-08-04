import requests

BASE_URL = "http://127.0.0.1:5050/api"
ADMIN_USERNAME = "admintest"
ADMIN_PASSWORD = "adminpass"
ADMIN_EMAIL = "admintest@example.com"

def print_response(desc, res):
    try:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.json())
    except:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.text)

print("=== Admin API Tests ===\n")

# 1️⃣ Register Admin User
res = requests.post(f"{BASE_URL}/register", json={
    "username": ADMIN_USERNAME,
    "email": ADMIN_EMAIL,
    "password": ADMIN_PASSWORD,
    "role": "admin"
})
print_response("Register Admin", res)

# 2️⃣ Login to get JWT
res = requests.post(f"{BASE_URL}/login", json={
    "username": ADMIN_USERNAME,
    "password": ADMIN_PASSWORD
})
print_response("Login Admin", res)

if res.status_code != 200:
    print("Admin login failed, exiting tests.")
    exit()

token = res.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 3️⃣ Test Admin GET Endpoints
print("\n=== GET Admin Endpoints ===")
res = requests.get(f"{BASE_URL}/admin/users", headers=headers)
print_response("Get All Users", res)

res = requests.get(f"{BASE_URL}/admin/trainers/pending", headers=headers)
print_response("Get Pending Trainers", res)

res = requests.get(f"{BASE_URL}/admin/contents/pending", headers=headers)
print_response("Get Pending Contents", res)

res = requests.get(f"{BASE_URL}/admin/reports/download/users", headers=headers)
print_response("Download User Report", res)

res = requests.get(f"{BASE_URL}/admin/reports/download/summary", headers=headers)
print_response("Download Summary Report", res)

# 4️⃣ Test Block/Unblock User
print("\n=== POST Block/Unblock User ===")
# Assuming user_id=1 exists in DB
res = requests.post(f"{BASE_URL}/admin/block", json={"user_id": 1}, headers=headers)
print_response("Block User 1", res)

res = requests.post(f"{BASE_URL}/admin/unblock", json={"user_id": 1}, headers=headers)
print_response("Unblock User 1", res)

print("\n=== Admin Tests Completed ===")
