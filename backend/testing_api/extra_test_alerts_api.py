import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "alertuser"
PASSWORD = "alertpass"
EMAIL = "alertuser@example.com"

def print_response(desc, res):
    try:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.json())
    except:
        print(f"{desc} -> Status: {res.status_code}, Response:", res.text)

# Step 1: Register test user
print("=== Register User ===")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print_response("Register", res)

# Test 1.1: Register with missing field
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME + "2"
})
print_response("Register missing fields", res)

# Test 1.2: Register duplicate
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print_response("Register duplicate user", res)

# Step 2: Login to get JWT token
print("\n=== Login ===")
res = requests.post(f"{BASE_URL}/login", json={
    "username": USERNAME,
    "password": PASSWORD
})
print_response("Login", res)

if res.status_code != 200:
    print("Login failed, exiting tests.")
    exit()

token = res.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

# Test 2.1: Login wrong password
res = requests.post(f"{BASE_URL}/login", json={
    "username": USERNAME,
    "password": "wrongpass"
})
print_response("Login wrong password", res)

# Step 3: Post Alerts
print("\n=== Post Alerts ===")

# 3.1 Valid alert
res = requests.post(f"{BASE_URL}/alerts/post", json={"message": "System maintenance tonight"}, headers=headers)
print_response("Post alert valid", res)

# 3.2 Missing message
res = requests.post(f"{BASE_URL}/alerts/post", json={}, headers=headers)
print_response("Post alert missing message", res)

# 3.3 Without JWT
res = requests.post(f"{BASE_URL}/alerts/post", json={"message": "Test without token"})
print_response("Post alert without JWT", res)

# Step 4: Delete Alerts
print("\n=== Delete Alerts ===")

# 4.1 Valid deletion (assuming ID=1 exists from seeding)
res = requests.delete(f"{BASE_URL}/alerts/delete/1", headers=headers)
print_response("Delete alert ID 1", res)

# 4.2 Non-existent alert
res = requests.delete(f"{BASE_URL}/alerts/delete/999", headers=headers)
print_response("Delete non-existent alert", res)

# 4.3 Without JWT
res = requests.delete(f"{BASE_URL}/alerts/delete/1")
print_response("Delete alert without JWT", res)

# 4.4 Wrong HTTP Method
res = requests.post(f"{BASE_URL}/alerts/delete/1", headers=headers)
print_response("Wrong HTTP method for delete", res)

print("\n=== Tests Completed ===")
