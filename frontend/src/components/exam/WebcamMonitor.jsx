import { useEffect, useRef, useState } from "react";

function WebcamMonitor() {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsActive(true);
    } catch (err) {
      setError("Unable to access webcam. Please check camera permissions.");
      console.error("Webcam error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
  };

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        Webcam Monitoring
      </h3>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg bg-gray-900 aspect-video object-cover"
      />

      <p className="text-sm text-gray-600 mt-3">
        Camera status: {isActive ? "Active" : "Inactive"}
      </p>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      <div className="flex gap-3 mt-4">
        {!isActive ? (
          <button
            onClick={startCamera}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}

export default WebcamMonitor;