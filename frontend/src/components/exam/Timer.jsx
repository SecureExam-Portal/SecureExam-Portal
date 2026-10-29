
import { useEffect, useRef, useState } from "react";

function Timer({ durationInSeconds = 3600, onTimeUp, isActive = true }) {
  const [seconds, setSeconds] = useState(durationInSeconds);
  const timeUpCallback = useRef(onTimeUp);
  const hasExpired = useRef(false);

  useEffect(() => {
    timeUpCallback.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isActive || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(interval);

          if (!hasExpired.current) {
            hasExpired.current = true;
            timeUpCallback.current?.();
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, seconds > 0]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  const isLowTime = seconds <= 300;

  return (
    <div
      className={`rounded-xl border p-4 ${
        isLowTime
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-blue-100 bg-blue-50 text-blue-950"
      }`}
      aria-live="polite"
    >
      <p className="text-xs font-semibold uppercase tracking-wide">
        Time Remaining
      </p>
      <p className="mt-1 font-mono text-2xl font-bold">{formattedTime}</p>
      {isLowTime && seconds > 0 && (
        <p className="mt-1 text-xs">Less than five minutes remaining.</p>
      )}
      {seconds === 0 && (
        <p className="mt-1 text-xs">Time is up.</p>
      )}
    </div>
  );
}

export default Timer;
