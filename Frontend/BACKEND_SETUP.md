# Flask Backend Setup for DeepGuard AI Frontend

## Required Changes to Your Flask Backend

To connect this React frontend with your Flask backend, you need to enable CORS (Cross-Origin Resource Sharing).

### 1. Install Flask-CORS

```bash
pip install flask-cors
```

### 2. Update Your Flask App

Add these lines to your `app.py`:

```python
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import os
import cv2

from utils.video_utils import extract_frames
from utils.face_utils import detect_faces
from utils.Preprocessing import preprocess_frame
from model.prediction import predict_with_heatmap

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/detect", methods=["POST"])
def detect():
    try:
        file = request.files["video"]
        video_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(video_path)

        frames = extract_frames(video_path)
        scores = []

        for frame in frames:
            faces = detect_faces(frame)
            for face in faces:
                tensor = preprocess_frame(face)
                score, heatmap_img = predict_with_heatmap(face, tensor)
                scores.append(score)
                output_path = os.path.join(UPLOAD_FOLDER, "result.jpg")
                cv2.imwrite(output_path, heatmap_img)

        if len(scores) == 0:
            return "No faces detected", 400

        final_score = sum(scores) / len(scores)

        if final_score > 0.5:
            result = "Deepfake Detected"
        else:
            result = "Authentic Video"

        # Return JSON response (optional, better than HTML)
        return jsonify({
            "result": result,
            "score": final_score,
            "frames_analyzed": len(frames),
            "faces_detected": len(scores)
        })

        # Or keep your HTML response:
        # return f"""
        # Result: {result}<br>
        # Deepfake Score: {final_score:.2f}<br>
        # <img src='/static/uploads/result.jpg' width='400'>
        # """

    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### 3. Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default.

If your Flask server runs on a different port or host, update line 27 in `/src/app/App.tsx`:

```typescript
const BACKEND_URL = "http://localhost:5000";  // Change this to your backend URL
```

### 4. Running the Application

**Terminal 1 - Flask Backend:**
```bash
cd your-flask-project
python app.py
```

**Terminal 2 - React Frontend:**
```bash
# In this Figma Make project
npm run dev
```

### 5. Testing the Connection

1. Start your Flask backend first
2. The frontend will be accessible at the URL provided by Figma Make
3. Upload a video file (MP4, AVI, MOV, WebM)
4. Click "Start Video Analysis"
5. Results will display including the heatmap image

### 6. Troubleshooting

**Error: "Cannot connect to backend"**
- Make sure Flask is running on port 5000
- Check that CORS is properly installed and configured
- Verify the BACKEND_URL in App.tsx matches your Flask server

**Error: "No faces detected"**
- Ensure your video contains visible faces
- Check that your face detection model is working
- Verify the video file is not corrupted

**Heatmap not showing:**
- Ensure the `/static/uploads/` folder exists
- Check file permissions for writing images
- Verify the heatmap generation code is working

### 7. Production Deployment

For production:
- Set `debug=False` in Flask
- Use a production WSGI server like Gunicorn
- Configure proper CORS origins instead of allowing all
- Add proper error handling and validation
- Implement file size limits and security checks

```python
# Production CORS example
CORS(app, resources={
    r"/detect": {"origins": "https://yourdomain.com"}
})
```
