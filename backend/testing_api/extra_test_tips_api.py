import requests

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "pare343cdsdwfwcnt1"
PASSWORD = "parewcaacfewntpass"
EMAIL = "pareacccccccnt1@example.com"

# Step 1: Register Parent User
print("Registering parent...")
res = requests.post(f"{BASE_URL}/register", json={
    "username": USERNAME,
    "email": EMAIL,
    "password": PASSWORD,
    "role": "parent"
})
print("Register status:", res.status_code, res.json())

# Step 2: Login as Parent to get JWT Token
print("\nLogging in as parent...")
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

headers = {"Authorization": f"Bearer {token}"}


# Step 2.1: Create a new tip
print("\nCreating a new tip...")
res = requests.post(f"{BASE_URL}/tips", headers=headers, json={
    "title": "Healthy Eating for Kids",
    "content": "Encourage your child to eat fruits and vegetables daily."
})
print("Status:", res.status_code)
print("Response:", res.json())
tip_id = res.json().get("tip_id", 2)


# Step 3: Test Tips Endpoints

# 3.1 Get all tips
print("\nFetching all tips...")
res = requests.get(f"{BASE_URL}/tips", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())

# 3.2 Mark tip viewed (example with tip_id=1)
print("\nMarking tip 1 as viewed by parent 1...")
res = requests.post(f"{BASE_URL}/tips/viewed", headers=headers, json={
    "parent_id": 1,
    "tip_id": 1
})
print("Status:", res.status_code)
print("Response:", res.json())

# 3.3 Get viewed tips by parent 1
print("\nFetching viewed tips for parent 1...")
res = requests.get(f"{BASE_URL}/tips/viewed/1", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())

# 3.4 Get viewed tips by parent who isn't existent (100)
print("\nFetching viewed tips for parent 100...")
res = requests.get(f"{BASE_URL}/tips/viewed/100", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())


# 3.5 Delete tip (example tip_id=1)
print("\nDeleting tip 1...")
res = requests.delete(f"{BASE_URL}/tips/delete/1", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())


# 3.6 Delete tip which is non existent (example tip_id=1)
print("\nDeleting tip 100...")
res = requests.delete(f"{BASE_URL}/tips/delete/100", headers=headers)
print("Status:", res.status_code)
print("Response:", res.json())