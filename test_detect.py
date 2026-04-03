import requests
import os

BASE_URL = "http://127.0.0.1:5000"

def test_detection():
    # 1. Login
    session = requests.Session()
    login_data = {"username": "tester1", "password": "Password123!"}
    r = session.post(f"{BASE_URL}/login", json=login_data)
    print(f"Login status: {r.status_code}")
    print(f"Login response: {r.json()}")

    if r.status_code != 200:
        return

    # 2. Upload a video for detection
    video_path = "static/uploads/prototype 2.mp4" # Using an existing small video
    if not os.path.exists(video_path):
        print(f"Video {video_path} not found")
        return

    print(f"Starting detection for {video_path}...")
    with open(video_path, "rb") as f:
        files = {"video": f}
        r = session.post(f"{BASE_URL}/detect", files=files)
        
    print(f"Detection status: {r.status_code}")
    try:
        print(f"Detection response: {r.json()}")
    except:
        print(f"Detection response (text): {r.text}")

if __name__ == "__main__":
    test_detection()
