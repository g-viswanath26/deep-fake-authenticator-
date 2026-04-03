import requests

BASE_URL = "http://127.0.0.1:5000"

def test_auth():
    session = requests.Session()
    
    # 1. Register
    print("Testing Registration...")
    reg_data = {"username": "testuser", "password": "testpassword"}
    r = session.post(f"{BASE_URL}/register", json=reg_data)
    print(f"Register status: {r.status_code}, response: {r.json()}")
    
    # 2. Login
    print("\nTesting Login...")
    login_data = {"username": "testuser", "password": "testpassword"}
    r = session.post(f"{BASE_URL}/login", json=login_data)
    print(f"Login status: {r.status_code}, response: {r.json()}")
    print(f"Cookies: {session.cookies.get_dict()}")
    
    # 3. Auth Check
    print("\nTesting Auth Check...")
    r = session.get(f"{BASE_URL}/auth-check")
    print(f"Auth Check status: {r.status_code}, response: {r.json()}")
    
    # 4. Logout
    print("\nTesting Logout...")
    r = session.get(f"{BASE_URL}/logout")
    print(f"Logout status: {r.status_code}, response: {r.json()}")
    
    # 5. Final Auth Check
    print("\nTesting Final Auth Check...")
    r = session.get(f"{BASE_URL}/auth-check")
    print(f"Final Auth Check status: {r.status_code}, response: {r.json()}")

if __name__ == "__main__":
    test_auth()
