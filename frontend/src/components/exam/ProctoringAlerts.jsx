import React from "react";

function ProctoringAlerts({ alerts = [] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">
        Proctoring Alerts
      </h3>

      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500">
          No violations detected.
        </p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={alert.id || index}
              className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3"
            >
              <span className="text-red-600 font-bold">!</span>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  {alert.type || "Proctoring Alert"}
                </p>

                <p className="text-sm text-red-700">
                  {alert.message || alert.details?.message || "Suspicious activity detected."}
                </p>

                {alert.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProctoringAlerts;