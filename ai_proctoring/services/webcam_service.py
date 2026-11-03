import cv2


class WebcamService:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.camera = None

    def start(self):
        if self.camera is None or not self.camera.isOpened():
            self.camera = cv2.VideoCapture(self.camera_index)

        return self.camera.isOpened()

    def get_frame(self):
        if self.camera is None or not self.camera.isOpened():
            return None

        success, frame = self.camera.read()

        if not success:
            return None

        return frame

    def stop(self):
        if self.camera is not None:
            self.camera.release()
            self.camera = None