import cv2

from config.settings import LOW_LIGHT_THRESHOLD


class LowLightDetector:
    def __init__(self, threshold=LOW_LIGHT_THRESHOLD):
        self.threshold = threshold

    def detect_low_light(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        brightness = gray.mean()

        return {
            "brightness": round(float(brightness), 2),
            "low_light": brightness < self.threshold
        }