import requests

BASE_URL = "http://127.0.0.1:5050/api"
TEST_USERNAME = "testuser"
TEST_PASSWORD = "testpass"
TEST_EMAIL = "testuser@example.com"

def print_response(desc, res):
    try:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.json())
    except:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.text)

print("=== Notification API Tests ===\n")

# 1️⃣ Register Test User
res = requests.post(f"{BASE_URL}/register", json={
    "username": TEST_USERNAME,
    "email": TEST_EMAIL,
    "password": TEST_PASSWORD,
    "role": "student"
})
print_response("Register Test User", res)

# 2️⃣ Login to get JWT
res = requests.post(f"{BASE_URL}/login", json={
    "username": TEST_USERNAME,
    "password": TEST_PASSWORD
})
print_response("Login Test User", res)

if res.status_code != 200:
    print("Login failed, exiting tests.")
    exit()

token = res.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# 3️⃣ Test GET Notifications for this user
print("\n=== GET Notifications ===")
user_id = 1  # Replace with actual user_id from DB if needed
res = requests.get(f"{BASE_URL}/notifications/{user_id}", headers=headers)
print_response(f"Get Notifications for user_id={user_id}", res)

# 4️⃣ Test GET Notifications for invalid user_id
invalid_user_id = 9999
res = requests.get(f"{BASE_URL}/notifications/{invalid_user_id}", headers=headers)
print_response(f"Get Notifications for user_id={invalid_user_id}", res)

# 5️⃣ Test GET Notifications without token (Unauthorized)
res = requests.get(f"{BASE_URL}/notifications/{user_id}")
print_response("Get Notifications without token", res)

# 6️⃣ Test GET Notifications with invalid token
invalid_headers = {"Authorization": "Bearer invalidtoken"}
res = requests.get(f"{BASE_URL}/notifications/{user_id}", headers=invalid_headers)
print_response("Get Notifications with invalid token", res)

print("\n=== Notification API Tests Completed ===")
