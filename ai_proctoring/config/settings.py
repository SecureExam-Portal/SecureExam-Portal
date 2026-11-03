import os

# Application settings
APP_NAME = "SecureExam-AI"
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Webcam settings
WEBCAM_INDEX = int(os.getenv("WEBCAM_INDEX", "0"))
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# Face detection settings
FACE_DETECTION_CONFIDENCE = 0.5
MULTIPLE_FACE_THRESHOLD = 1

# Lighting detection settings
LOW_LIGHT_THRESHOLD = 50

# WebSocket settings
WEBSOCKET_HOST = os.getenv("WEBSOCKET_HOST", "localhost")
WEBSOCKET_PORT = int(os.getenv("WEBSOCKET_PORT", "8000"))