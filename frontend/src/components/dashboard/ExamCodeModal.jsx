
import { useState } from "react";

function ExamCodeModal({ isOpen, onClose, onSubmit, loading = false }) {
  const [examCode, setExamCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const code = examCode.trim();

    if (!code) {
      setError("Please enter your exam code.");
      return;
    }

    setError("");

    try {
      await onSubmit?.(code);
    } catch {
      setError("Unable to join the exam. Please try again.");
    }
  };

  const handleClose = () => {
    setExamCode("");
    setError("");
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-code-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="exam-code-title" className="text-xl font-bold text-blue-950">
              Join an Exam
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter the exam code provided by your institution.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close dialog"
            className="rounded-lg px-3 py-1 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="exam-code"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Exam Code
          </label>

          <input
            id="exam-code"
            type="text"
            value={examCode}
            onChange={(event) => {
              setExamCode(event.target.value);
              setError("");
            }}
            placeholder="Enter exam code"
            autoComplete="off"
            required
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />

          {error && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !examCode.trim()}
              className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-blue-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Exam"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ExamCodeModal;
