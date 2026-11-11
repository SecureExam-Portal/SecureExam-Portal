import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar, { MobileMenuButton } from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import ExamCard from "../components/dashboard/ExamCard";
import ExamCodeModal from "../components/dashboard/ExamCodeModal";
import { getExams, joinExam } from "../services/examService";
import { getMyResults } from "../services/resultService";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real exams and student results
  useEffect(() => {
    let mounted = true;
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [examsData, resultsData] = await Promise.all([
          getExams(),
          getMyResults(),
        ]);
        if (mounted) {
          setExams(examsData || []);
          setResults(resultsData || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (mounted) {
          setError("Failed to load your dashboard data.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      mounted = false;
    };
  }, []);

  // Check attempt limit before allowing student to enter
  const handleEnterExam = (exam) => {
    const studentAttempts = results.filter(
      (r) => (r.exam?._id || r.exam) === exam._id
    );
    const maxAllowed = exam.allowReattempt ? exam.maxAttempts : 1;

    if (studentAttempts.length >= maxAllowed) {
      alert(`You have reached the maximum allowed submission limit (${maxAllowed}) for this exam.`);
      return;
    }

    if (exam.accessType === "private" && exam.examCode) {
      setSelectedExam(exam);
      setIsModalOpen(true);
    } else {
      navigate(`/exam/${exam._id}`, { state: { codeVerified: true } });
    }
  };

  const handleJoinExam = async (examCode) => {
    // Call join API which validates both code and submission limit
    const response = await joinExam(examCode);
    setIsModalOpen(false);
    if (response?.examId) {
      navigate(`/exam/${response.examId}`, { state: { codeVerified: true } });
    } else if (response?._id) {
      navigate(`/exam/${response._id}`, { state: { codeVerified: true } });
    }
  };

  // Derive stats
  const completedCount = results.length;
  const availableCount = exams.filter((e) => {
    const studentAttempts = results.filter((r) => (r.exam?._id || r.exam) === e._id);
    const maxAllowed = e.allowReattempt ? e.maxAttempts : 1;
    return studentAttempts.length < maxAllowed;
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem="Overview"
      />

      <div className="flex-1 lg:ml-72 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 px-4 pt-4 lg:hidden">
          <MobileMenuButton onClick={() => setSidebarOpen(true)} />
        </div>

        <DashboardHeader
          title="Student Dashboard"
          studentName={user?.name || "Student"}
        />

        <main className="mx-auto max-w-7xl w-full space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <WelcomeBanner studentName={user?.name || "Student"} />

          <section aria-label="Exam statistics">
            <h2 className="mb-4 text-xl font-bold text-blue-950">
              Your Overview
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Available Exams"
                value={loading ? "..." : availableCount}
                description="Exams currently available to enter"
                icon="▤"
                accent="blue"
              />
              <StatCard
                title="Total Completed"
                value={loading ? "..." : completedCount}
                description="Completed exam attempts"
                icon="✓"
                accent="green"
              />
              <StatCard
                title="All Published"
                value={loading ? "..." : exams.length}
                description="Total active examinations on the portal"
                icon="◷"
                accent="amber"
              />
            </div>
          </section>

          <section id="exams">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">My Exams</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select an available exam or enter a private exam passcode.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedExam(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
              >
                <span>+</span> Enter Exam Code
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                Loading available exams...
              </div>
            ) : exams.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                No exams are currently available. Check back soon or enter a private exam code above!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {exams.map((exam) => {
                  const studentAttempts = results.filter(
                    (r) => (r.exam?._id || r.exam) === exam._id
                  );
                  const attemptCount = studentAttempts.length;
                  const maxAllowed = exam.allowReattempt ? exam.maxAttempts : 1;
                  const isLimitHit = attemptCount >= maxAllowed;
                  const remainingAttempts = Math.max(0, maxAllowed - attemptCount);

                  return (
                    <ExamCard
                      key={exam._id}
                      exam={{
                        ...exam,
                        status: isLimitHit ? "Limit Reached" : "Available",
                        isCompleted: isLimitHit,
                        isAvailable: !isLimitHit,
                        attemptCount,
                        maxAttempts: maxAllowed,
                        remainingAttempts,
                        subject: exam.accessType === "private" ? "Private Exam" : "Public Exam",
                      }}
                      onEnterExam={() => handleEnterExam(exam)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      <ExamCodeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExam(null);
        }}
        examCode={selectedExam?.examCode || ""}
        onSubmit={handleJoinExam}
      />
    </div>
  );
}

export default StudentDashboard;
