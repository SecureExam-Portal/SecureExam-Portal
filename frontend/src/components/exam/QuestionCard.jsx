
function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelect,
}) {
  if (!question) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Question {questionNumber}
          </p>
          <h2 className="mt-2 text-lg font-semibold leading-relaxed text-slate-900">
            {question.text}
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {question.marks ?? 1} mark{question.marks === 1 || question.marks == null ? "" : "s"}
        </span>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm text-slate-500">
          Select one answer
        </legend>

        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;

          return (
            <label
              key={`${question.id}-${index}`}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={isSelected}
                onChange={() => onSelect(question.id, option)}
                className="mt-1 h-4 w-4 accent-blue-700"
              />

              <span className="text-sm leading-relaxed text-slate-800">
                <span className="mr-2 font-semibold text-slate-500">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </span>
            </label>
          );
        })}
      </fieldset>
    </section>
  );
}

export default QuestionCard;
