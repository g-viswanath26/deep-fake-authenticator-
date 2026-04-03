import cv2
import numpy as np
import torch
from torchvision import transforms
from PIL import Image


# Standard ImageNet normalization values - used for pretrained models
_transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],   # ImageNet mean
        std=[0.229, 0.224, 0.225]     # ImageNet std
    )
])


def preprocess_frame(face):
    """
    Preprocess a face crop for CNN inference.
    
    Args:
        face: BGR numpy array (face image, 224x224 from detect_faces)
    
    Returns:
        PyTorch tensor of shape (1, 3, 224, 224), normalized for CNN
    """
    if not isinstance(face, np.ndarray):
        raise ValueError(f"Expected numpy array, got {type(face)}")
    
    # Convert BGR (OpenCV) to RGB (PyTorch/PIL convention)
    face_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
    
    # Apply transforms: resize, to tensor, normalize
    tensor = _transform(face_rgb)
    
    # Add batch dimension: (3, 224, 224) -> (1, 3, 224, 224)
    tensor = tensor.unsqueeze(0)
    
    return tensor
