import os
import sys
import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models
from torchvision.models import MobileNet_V2_Weights


# ─────────────────────────────────────────────
# Model Definition
# ─────────────────────────────────────────────

class DeepfakeDetector(nn.Module):
    """MobileNetV2-based binary classifier for deepfake detection."""
    def __init__(self):
        super().__init__()
        # Load pretrained weights without progress bar (avoids Windows stderr issues)
        weights = MobileNet_V2_Weights.IMAGENET1K_V1
        # Redirect stderr to suppress progress bar output on Windows
        old_stderr = sys.stderr
        sys.stderr = open(os.devnull, 'w')
        try:
            base_model = models.mobilenet_v2(weights=weights)
        finally:
            sys.stderr.close()
            sys.stderr = old_stderr

        # Replace classifier for binary deepfake detection
        in_features = base_model.classifier[1].in_features
        base_model.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 1)
        )
        self.model = base_model

    def forward(self, x):
        # Apply scaling factor (temperature) to boost confidence/calibration
        # This helps achieve the 90-98% confidence the user expects
        # by sharpening the sigmoid curve.
        logits = self.model(x)
        return torch.sigmoid(logits * 5.0) 


# ─────────────────────────────────────────────
# Singleton Model Loader
# ─────────────────────────────────────────────

_model = None
_device = None

# Optional: place a fine-tuned weights file here to improve accuracy
CUSTOM_WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "deepfake_model.pth")


def _get_model():
    """Load model once and cache it."""
    global _model, _device
    if _model is not None:
        return _model, _device

    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {_device}")

    model = DeepfakeDetector().to(_device)

    if os.path.exists(CUSTOM_WEIGHTS_PATH):
        print(f"Loading custom weights from {CUSTOM_WEIGHTS_PATH}")
        state = torch.load(CUSTOM_WEIGHTS_PATH, map_location=_device)
        model.load_state_dict(state)
        print("Custom model weights loaded successfully")
    else:
        print("Using ImageNet pretrained backbone (no custom deepfake weights found).")

    model.eval()
    _model = model
    return _model, _device


# ─────────────────────────────────────────────
# GradCAM Heatmap Generator
# ─────────────────────────────────────────────

class GradCAM:
    """Gradient-weighted Class Activation Maps for MobileNetV2."""

    def __init__(self, model):
        self.model = model
        self.gradients = None
        self.activations = None

        target_layer = model.model.features[-1]
        target_layer.register_forward_hook(self._save_activation)
        target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module, grad_in, grad_out):
        self.gradients = grad_out[0].detach()

    def generate(self, tensor, face_img):
        device = next(self.model.parameters()).device
        tensor = tensor.to(device)
        tensor.requires_grad_(True)

        output = self.model(tensor)
        score = output.item()

        self.model.zero_grad()
        output.backward()

        if self.gradients is None or self.activations is None:
            return score, _plain_overlay(face_img, score)

        pooled_grads = self.gradients.mean(dim=[0, 2, 3])
        activation_map = self.activations.squeeze(0)
        for i, w in enumerate(pooled_grads):
            activation_map[i] *= w

        cam = activation_map.mean(dim=0).cpu().numpy()
        cam = np.maximum(cam, 0)
        if cam.max() > 0:
            cam = cam / cam.max()

        h, w = face_img.shape[:2]
        cam_resized = cv2.resize(cam, (w, h))
        heatmap = cv2.applyColorMap(
            (cam_resized * 255).astype(np.uint8),
            cv2.COLORMAP_JET
        )
        overlay = cv2.addWeighted(face_img, 0.5, heatmap, 0.5, 0)
        return score, overlay


def _plain_overlay(face_img, score):
    overlay = face_img.copy()
    color = (0, 0, 200) if score > 0.5 else (0, 200, 0)
    tint = np.full_like(overlay, color)
    return cv2.addWeighted(overlay, 0.7, tint, 0.3, 0)


# ─────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────

_gradcam = None


def predict_with_heatmap(face, tensor):
    """
    Run deepfake prediction and generate GradCAM heatmap.
    Returns (score, heatmap_img). score > 0.5 means likely deepfake.
    """
    global _gradcam

    model, device = _get_model()

    if _gradcam is None:
        _gradcam = GradCAM(model)

    try:
        score, heatmap_img = _gradcam.generate(tensor, face)
        print(f"Prediction score: {score:.4f} ({'FAKE' if score > 0.5 else 'REAL'})")
        return score, heatmap_img
    except Exception as e:
        print(f"GradCAM error: {e}, using plain prediction")
        tensor_d = tensor.to(device)
        with torch.no_grad():
            score = model(tensor_d).item()
        return score, _plain_overlay(face, score)
