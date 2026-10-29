
function SubmitButton({ onClick, disabled = false, label = "Submit Exam" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-lg bg-amber-400 px-5 py-3 font-semibold text-blue-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {label}
    </button>
  );
}

export default SubmitButton;
