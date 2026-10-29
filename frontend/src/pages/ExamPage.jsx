
import { useCallback, useState } from "react";
import ExamHeader from "../components/exam/ExamHeader";
import QuestionCard from "../components/exam/QuestionCard";
import Timer from "../components/exam/Timer";
import SubmitButton from "../components/exam/SubmitButton";
import ViolationPanel from "../components/exam/ViolationPanel";

const sampleQuestions = [
  {
    id: "q1",
    text: "Which data structure follows the FIFO principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    marks: 1,
  },
  {
    id: "q2",
    text: "Which language is primarily used to style web pages?",
    options: ["HTML", "Python", "CSS", "SQL"],
    marks: 1,
  },
  {
    id: "q3",
    text: "Which HTTP status code usually indicates a successful request?",
    options: ["200", "404", "500", "301"],
    marks: 1,
  },
];

function ExamPage() {
  const [questions] = useState(sampleQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations] = useState([]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (questionId, answer) => {
    if (isSubmitted) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  const confirmSubmit = () => {
    if (isSubmitted) return;

    const unanswered = questions.length - answeredCount;
    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Are you sure you want to submit your exam?";

    if (window.confirm(message)) {
      handleSubmit();
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
          </div>

          <h1 className="mt-4 text-2xl font-bold text-blue-950">
            Exam Submitted
          </h1>

          <p className="mt-2 text-slate-600">
            Your answers have been recorded in this demo.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Questions answered: {answeredCount} of {questions.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            This demo does not send answers to the backend.
          </p>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        No questions are available for this exam.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamHeader
          title="Sample Online Examination"
          subject="Computer Science"
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              selectedAnswer={answers[currentQuestion.id]}
              onSelect={handleSelectAnswer}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((index) => Math.max(0, index - 1))
                }
                disabled={currentIndex === 0}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-500">
                {answeredCount} of {questions.length} answered
              </span>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((index) =>
                      Math.min(questions.length - 1, index + 1)
                    )
                  }
                  className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Next Question
                </button>
              ) : (
                <SubmitButton onClick={confirmSubmit} />
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <Timer
              durationInSeconds={3600}
              isActive={!isSubmitted}
              onTimeUp={handleSubmit}
            />

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="font-semibold text-slate-900">
                Question Navigator
              </h2>

              <div className="mt-3 grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const isAnswered = Boolean(answers[question.id]);
                  const isCurrent = index === currentIndex;

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Go to question ${index + 1}`}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`h-10 rounded-lg border text-sm font-semibold ${
                        isCurrent
                          ? "border-blue-900 bg-blue-900 text-white"
                          : isAnswered
                            ? "border-green-300 bg-green-50 text-green-800"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Blue: current · Green: answered · White: unanswered
              </p>
            </section>

            <ViolationPanel violations={violations} />

            <SubmitButton
              onClick={confirmSubmit}
              label="Review & Submit Exam"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default ExamPage;
