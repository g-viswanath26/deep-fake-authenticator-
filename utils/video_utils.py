import cv2


def extract_frames(video_path, max_frames=20, frame_interval=None):
    """
    Extract frames from a video file using OpenCV.
    
    Args:
        video_path: Path to the video file
        max_frames: Maximum number of frames to extract
        frame_interval: Extract every Nth frame. If None, auto-calculated.
    
    Returns:
        List of frames (numpy arrays in BGR format)
    """
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        raise ValueError(f"Cannot open video file: {video_path}")
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    print(f"Video info: {total_frames} total frames at {fps:.1f} FPS")
    
    # Auto-calculate interval to spread frames evenly across the video
    if frame_interval is None:
        frame_interval = max(1, total_frames // max_frames)
    
    frames = []
    frame_idx = 0
    
    while cap.isOpened() and len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_idx % frame_interval == 0:
            frames.append(frame)
        
        frame_idx += 1
    
    cap.release()
    
    print(f"Extracted {len(frames)} frames from {video_path}")
    return frames
