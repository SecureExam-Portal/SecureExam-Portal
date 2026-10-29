
function ViolationPanel({ violations = [] }) {
  return (
    <aside
      className="rounded-xl border border-slate-200 bg-white p-4"
      aria-label="Proctoring notifications"
    >
      <h2 className="font-semibold text-slate-900">
        Proctoring Notifications
      </h2>

      {violations.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">
          No notifications to display.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {violations.map((violation, index) => (
            <li
              key={violation.id ?? `${violation.message}-${index}`}
              className={`rounded-lg border p-3 text-sm ${
                violation.severity === "high"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-medium">
                {violation.message}
              </p>
              {violation.time && (
                <p className="mt-1 text-xs opacity-80">
                  {violation.time}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default ViolationPanel;
