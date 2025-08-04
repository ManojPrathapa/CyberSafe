import requests
import time

BASE_URL = "http://127.0.0.1:5050/api"
USERNAME = "student12278"
PASSWORD = "studentp233ass"
EMAIL = "student1433@example.com"

STUDENT_ID = 1  # Change if your DB uses different IDs

def print_response(step, response):
    """Helper to print step details"""
    print(f"\n--- {step} ---")
    print("Status:", response.status_code)
    try:
        print("Response:", response.json())
    except:
        print("Raw Response:", response.text)


def main():
    # Step 1: Register Student User
    res = requests.post(f"{BASE_URL}/register", json={
        "username": USERNAME,
        "email": EMAIL,
        "password": PASSWORD,
        "role": "student"
    })
    print_response("Register student", res)

    # Step 2: Attempt Duplicate Registration
    res = requests.post(f"{BASE_URL}/register", json={
        "username": USERNAME,
        "email": EMAIL,
        "password": PASSWORD,
        "role": "student"
    })
    print_response("Duplicate registration", res)

    # Step 3: Login with wrong credentials
    res = requests.post(f"{BASE_URL}/login", json={
        "username": USERNAME,
        "password": "wrongpass"
    })
    print_response("Login with wrong password", res)

    # Step 4: Login with correct credentials
    res = requests.post(f"{BASE_URL}/login", json={
        "username": USERNAME,
        "password": PASSWORD
    })
    if res.status_code != 200:
        print("Login failed! Cannot continue.")
        return
    data = res.json()
    token = data.get("access_token")
    print_response("Login with correct credentials", res)
    print("JWT Token:", token)

    headers = {"Authorization": f"Bearer {token}"}

    # Step 5: Access Student Attempts Endpoint without JWT
    res = requests.get(f"{BASE_URL}/student/{STUDENT_ID}/attempts")
    print_response("Fetch attempts WITHOUT JWT", res)

    # Step 6: Access Student Attempts Endpoint with JWT
    res = requests.get(f"{BASE_URL}/student/{STUDENT_ID}/attempts", headers=headers)
    print_response("Fetch attempts WITH JWT", res)

    # Step 7: Access with Invalid JWT
    fake_headers = {"Authorization": "Bearer invalidtoken123"}
    res = requests.get(f"{BASE_URL}/student/{STUDENT_ID}/attempts", headers=fake_headers)
    print_response("Fetch attempts with INVALID JWT", res)

    # Step 8: Simulate Expired JWT (optional demo)
    # JWT expiration is usually minutes/hours; here we just simulate delay
    print("\nSimulating expired token (sleep 2s)...")
    time.sleep(2)  # Adjust if your JWT expires fast
    res = requests.get(f"{BASE_URL}/student/{STUDENT_ID}/attempts", headers=headers)
    print_response("Fetch attempts with possibly expired JWT", res)

    # Step 9: Fetch attempts for invalid student ID
    invalid_id = 9999
    res = requests.get(f"{BASE_URL}/student/{invalid_id}/attempts", headers=headers)
    print_response(f"Fetch attempts for invalid student {invalid_id}", res)


if __name__ == "__main__":
    main()
