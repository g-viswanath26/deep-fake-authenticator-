from flask import Flask, request, render_template, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import sys
import uuid
import cv2

from utils.video_utils import extract_frames
from utils.face_utils import detect_faces
from utils.Preprocessing import preprocess_frame

from model.prediction import predict_with_heatmap


app = Flask(__name__, template_folder="Frontend/dist")
CORS(app, supports_credentials=True)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here' # In a real app, use environment variable

db = SQLAlchemy(app)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DIST_FOLDER = os.path.join(os.path.dirname(__file__), "Frontend", "dist")
ASSETS_FOLDER = os.path.join(DIST_FOLDER, "assets")





# ── Static assets (JS, CSS, etc.) ──────────────────────
@app.route("/assets/<path:filename>")
def serve_assets(filename):
    return send_from_directory(ASSETS_FOLDER, filename)


# ── Uploaded files (heatmap images) ────────────────────
@app.route("/static/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ── API: Deepfake detection ─────────────────────────────
@app.route("/detect", methods=["POST"])
def detect():
    try:
        file = request.files.get("video")
        if file is None:
            return jsonify({"error": "No video file provided"}), 400

        video_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(video_path)

        frames = extract_frames(video_path, max_frames=20)

        if len(frames) == 0:
            return jsonify({"error": "Could not extract frames from video"}), 400

        scores = []
        last_heatmap_img = None

        for frame in frames:
            faces = detect_faces(frame)
            for face in faces:
                tensor = preprocess_frame(face)
                score, heatmap_img = predict_with_heatmap(face, tensor)
                scores.append(score)
                last_heatmap_img = heatmap_img

        if len(scores) == 0:
            return jsonify({"error": "No faces detected in the video. Please upload a video containing a clearly visible face."}), 400

        final_score = sum(scores) / len(scores)
        result = "Deepfake Detected" if final_score > 0.5 else "Authentic Video"

        heatmap_url = None
        if last_heatmap_img is not None:
            filename = f"result_{uuid.uuid4().hex}.jpg"
            output_path = os.path.join(UPLOAD_FOLDER, filename)
            cv2.imwrite(output_path, last_heatmap_img)
            heatmap_url = f"/static/uploads/{filename}"

        return jsonify({
            "result": result,
            "score": round(float(final_score), 4),
            "heatmapUrl": heatmap_url,
            "framesAnalyzed": len(frames),
            "facesDetected": len(scores)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Frontend SPA catch-all (MUST be last) ───────────────
@app.route("/")
@app.route("/<path:path>")
def index(path=None):
    # Serve any root-level dist files (favicon, vite.svg, etc.)
    if path and os.path.isfile(os.path.join(DIST_FOLDER, path)):
        return send_from_directory(DIST_FOLDER, path)
    return send_from_directory(DIST_FOLDER, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=5000)