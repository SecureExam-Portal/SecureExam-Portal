import { useState } from "react";

function ExamCodeModal({
  isOpen,
  onClose,
  onSubmit,
  onVerified,
  examCode: prefilledExamCode = "",
  loading = false,
}) {
  const [examCode, setExamCode] = useState(prefilledExamCode);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const code = (examCode || prefilledExamCode || "").trim().toUpperCase();

    if (!code) {
      setError("Please enter your exam code.");
      return;
    }

    setError("");

    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(code);
      } else if (onVerified) {
        // Direct verification check if prefilled
        if (prefilledExamCode && code !== prefilledExamCode.toUpperCase()) {
          setError("Incorrect exam code. Please check and try again.");
          setSubmitting(false);
          return;
        }
        await onVerified(code);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Unable to join the exam. Please check the code.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setExamCode("");
    setError("");
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-code-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="exam-code-title" className="text-xl font-bold text-blue-950">
              Join an Exam
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter the access code provided by your instructor or institution.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading || submitting}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="exam-code"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Exam Passcode
          </label>

          <input
            id="exam-code"
            type="text"
            value={examCode}
            onChange={(event) => {
              setExamCode(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder="e.g. A1B2C3"
            autoComplete="off"
            autoFocus
            required
            disabled={loading || submitting}
            className="w-full uppercase tracking-widest text-center font-mono text-xl font-bold rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
          />

          {error && (
            <div role="alert" className="mt-3 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 border border-rose-200">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading || submitting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || submitting || !examCode.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-semibold text-blue-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm"
            >
              {loading || submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                "Join Exam"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ExamCodeModal;
