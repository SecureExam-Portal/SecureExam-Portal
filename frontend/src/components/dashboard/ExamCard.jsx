
function ExamCard({ exam, onEnterExam }) {
  const title = exam?.title || exam?.name || "Untitled Exam";
  const subject = exam?.subject || "General";
  const duration = exam?.duration ?? exam?.durationMinutes;
  const status = exam?.status || "Available";
  const isAvailable = status.toLowerCase() === "available";

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-900">
          <span aria-hidden="true">▤</span>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isAvailable
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-blue-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subject}</p>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Duration:</span>{" "}
          {duration != null ? `${duration} minutes` : "Not specified"}
        </p>
        {exam?.scheduledAt && (
          <p>
            <span className="font-medium text-slate-800">Scheduled:</span>{" "}
            {new Date(exam.scheduledAt).toLocaleString()}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onEnterExam?.(exam)}
        disabled={!isAvailable}
        className="mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
      >
        {isAvailable ? "Enter Exam" : "Unavailable"}
      </button>
    </article>
  );
}

export default ExamCard;
