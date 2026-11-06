import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ExamHeader from "../components/exam/ExamHeader";
import QuestionCard from "../components/exam/QuestionCard";
import Timer from "../components/exam/Timer";
import SubmitButton from "../components/exam/SubmitButton";
import WebcamMonitor from "../components/exam/WebcamMonitor";
import ProctoringAlerts from "../components/exam/ProctoringAlerts";

import { getExamById, getQuestionsByExam, submitExam } from "../services/examService";

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [startTime] = useState(Date.now());

  // Load real exam details and real questions from the backend
  useEffect(() => {
    let active = true;
    const fetchExamData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [examData, questionsData] = await Promise.all([
          getExamById(examId),
          getQuestionsByExam(examId),
        ]);

        if (active) {
          setExam(examData);
          // Normalize question properties if necessary
          const formattedQuestions = (questionsData || []).map((q) => ({
            id: q._id,
            _id: q._id,
            text: q.questionText || q.text,
            options: q.options || [],
            marks: q.marks || 1,
          }));
          setQuestions(formattedQuestions);
        }
      } catch (err) {
        console.error("Failed to load exam:", err);
        if (active) {
          setError(err?.response?.data?.message || "Failed to load examination.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
    return () => {
      active = false;
    };
  }, [examId]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (questionId, answer) => {
    if (isSubmitted || submitting) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (isSubmitted || submitting) return;

    try {
      setSubmitting(true);
      const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

      const payload = {
        examId,
        answers: Object.entries(answers).map(([qId, selected]) => ({
          questionId: qId,
          selectedAnswer: selected,
        })),
        timeTaken: timeTakenSeconds,
        violations: violations.length,
      };

      const result = await submitExam(payload);
      setSubmissionResult(result);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert(err?.response?.data?.message || "Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitted, submitting, examId, answers, startTime, violations.length]);

  const confirmSubmit = () => {
    if (isSubmitted || submitting) return;

    const unanswered = questions.length - answeredCount;

    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Are you sure you want to submit?`
        : "Are you sure you want to submit your examination?";

    if (window.confirm(message)) {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Preparing examination session...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
            ✕
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Exam Unavailable</h2>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
        <section className="mx-auto max-w-lg w-full rounded-2xl bg-white p-8 text-center shadow-lg border border-slate-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-bold text-blue-950">
            Exam Submitted Successfully!
          </h1>

          <p className="mt-2 text-slate-600 text-sm">
            Your responses have been processed and saved securely.
          </p>

          {submissionResult && (
            <div className="mt-6 rounded-xl bg-slate-50 p-5 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Score</p>
                  <p className="mt-1 text-2xl font-bold text-blue-950">
                    {submissionResult.score} / {questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Percentage</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">
                    {submissionResult.percentage}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/results")}
              className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-blue-950 hover:bg-amber-300 transition-colors shadow-sm"
            >
              View All Results
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm text-center">
          <p className="text-slate-700 font-medium mb-4">No questions are currently posted for this exam.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  const durationSeconds = (exam?.duration || 30) * 60;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamHeader
          title={exam?.title || "Online Examination"}
          subject={exam?.description || "General Assessment"}
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

            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
                disabled={currentIndex === 0}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm font-medium text-slate-600">
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
                  className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Next Question
                </button>
              ) : (
                <SubmitButton
                  onClick={confirmSubmit}
                  disabled={submitting}
                  label={submitting ? "Submitting..." : "Submit Examination"}
                />
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <Timer
              durationInSeconds={durationSeconds}
              isActive={!isSubmitted}
              onTimeUp={handleSubmit}
            />

            <WebcamMonitor />

            <ProctoringAlerts alerts={violations} />

            <SubmitButton
              onClick={confirmSubmit}
              disabled={submitting}
              label={submitting ? "Submitting..." : "Review & Submit"}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default ExamPage;
