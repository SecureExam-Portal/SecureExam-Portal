function ExamCard({ exam, onEnterExam }) {
  const title = exam?.title || exam?.name || "Untitled Exam";
  const subject = exam?.subject || "General";
  const duration = exam?.duration ?? exam?.durationMinutes;
  const status = exam?.status || "Available";
  const isAvailable = Boolean(exam?.isAvailable ?? (status.toLowerCase() === "available"));
  const isCompleted = Boolean(exam?.isCompleted);
  const attemptCount = exam?.attemptCount || 0;
  const maxAttempts = exam?.maxAttempts || 1;
  const remainingAttempts = exam?.remainingAttempts ?? (maxAttempts - attemptCount);

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-900">
          <span aria-hidden="true">▤</span>
        </div>

        {isCompleted ? (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Attempt Limit Reached
          </span>
        ) : attemptCount > 0 ? (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800">
            {attemptCount}/{maxAttempts} Attempts Used
          </span>
        ) : (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
            Available
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-bold text-blue-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subject}</p>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Duration:</span>{" "}
          {duration != null ? `${duration} minutes` : "Not specified"}
        </p>
        <p>
          <span className="font-medium text-slate-800">Attempts:</span>{" "}
          {attemptCount} of {maxAttempts} used
          {exam?.allowReattempt && !isCompleted && ` (${remainingAttempts} left)`}
        </p>
        {exam?.scheduledAt && (
          <p>
            <span className="font-medium text-slate-800">Scheduled:</span>{" "}
            {new Date(exam.scheduledAt).toLocaleString()}
          </p>
        )}
      </div>

      {isCompleted ? (
        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed border border-slate-300"
        >
          Submission Limit Reached ({maxAttempts}/{maxAttempts})
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onEnterExam?.(exam)}
          className="mt-6 w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 shadow-sm"
        >
          {attemptCount > 0 ? `Retake Exam (${remainingAttempts} left)` : "Enter Exam"}
        </button>
      )}
    </article>
  );
}

export default ExamCard;
