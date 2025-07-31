import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "alertuser"
PASSWORD = "alertpass"
EMAIL = "alertuser@example.com"

# Step 1: Register test user
print("Registering user for Alerts testing...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "student"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login to get JWT token
print("\nLogging in to get token...")
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
print("JWT Token acquired.")

# Step 3: Test posting an alert
print("\nPosting new alert...")
res = requests.post(f"{BASE_URL}/alerts/post", json={"message": "System maintenance tonight"}, headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())

# Step 4: Test deleting an alert (example ID=1)
print("\nDeleting alert with ID 1...")
res = requests.delete(f"{BASE_URL}/alerts/delete/1", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())
