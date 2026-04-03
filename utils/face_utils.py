import cv2
import numpy as np
import os

# Use OpenCV DNN-based face detector for better accuracy
_face_detector_net = None
_haar_cascade = None

def _get_haar_cascade():
    """Load OpenCV Haar Cascade face detector as a fallback."""
    global _haar_cascade
    if _haar_cascade is None:
        cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        _haar_cascade = cv2.CascadeClassifier(cascade_path)
        if _haar_cascade.empty():
            raise RuntimeError("Failed to load Haar Cascade face detector")
        print("Loaded Haar Cascade face detector")
    return _haar_cascade


def detect_faces(frame, min_size=64):
    """
    Detect faces in a frame using OpenCV Haar Cascade detector.
    
    Args:
        frame: BGR numpy array (video frame)
        min_size: Minimum face size in pixels to consider
    
    Returns:
        List of face crops (BGR numpy arrays), each 224x224
    """
    if not isinstance(frame, np.ndarray):
        print(f"Skipping non-frame input: {type(frame)}")
        return []

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    cascade = _get_haar_cascade()
    
    # Detect faces with multi-scale detection
    faces_rect = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(min_size, min_size),
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    
    face_crops = []
    
    if len(faces_rect) == 0:
        print("No faces detected in this frame")
        return face_crops
    
    h, w = frame.shape[:2]
    
    for (x, y, fw, fh) in faces_rect:
        # Add padding around face
        pad = int(min(fw, fh) * 0.2)
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(w, x + fw + pad)
        y2 = min(h, y + fh + pad)
        
        face_crop = frame[y1:y2, x1:x2]
        
        if face_crop.size == 0:
            continue
        
        # Resize to 224x224 for CNN input
        face_resized = cv2.resize(face_crop, (224, 224))
        face_crops.append(face_resized)
    
    print(f"Detected {len(face_crops)} face(s) in frame")
    return face_crops
