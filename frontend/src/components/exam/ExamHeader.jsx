function ExamHeader({ title, subject, currentQuestion, totalQuestions }) {
  return (
    <header className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-blue-950">
          {title || "Online Examination"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {subject || "General"}
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 px-4 py-3">
        <p className="text-xs font-medium text-blue-700">
          Question Progress
        </p>
        <p className="mt-1 text-lg font-bold text-blue-950">
          {currentQuestion} of {totalQuestions}
        </p>
      </div>
    </header>
  );
}

export default ExamHeader;