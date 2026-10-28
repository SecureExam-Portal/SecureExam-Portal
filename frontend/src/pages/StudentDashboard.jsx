
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCard from "../components/dashboard/StatCard";
import ExamCard from "../components/dashboard/ExamCard";
import ExamCodeModal from "../components/dashboard/ExamCodeModal";

function StudentDashboard() {
  const [activeItem, setActiveItem] = useState("Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Temporary display data until the exam API is connected.
  const exams = [
    {
      id: "demo-1",
      title: "Sample Mathematics Exam",
      subject: "Mathematics",
      duration: 60,
      status: "Available",
    },
    {
      id: "demo-2",
      title: "Sample Computer Science Exam",
      subject: "Computer Science",
      duration: 90,
      status: "Upcoming",
    },
  ];

  const handleEnterExam = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const handleJoinExam = async (examCode) => {
    // API integration will be added in the next step.
    console.log("Exam code submitted:", examCode);
    console.log("Selected exam:", selectedExam);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 md:flex" id="overview">
      <div className="hidden md:block">
        <Sidebar activeItem={activeItem} />
      </div>

      <div className="min-w-0 flex-1">
        <DashboardHeader studentName="Student" />

        <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <WelcomeBanner studentName="Student" />

          <section aria-label="Exam statistics">
            <h2 className="mb-4 text-xl font-bold text-blue-950">
              Your Overview
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                title="Available Exams"
                value={1}
                description="Exams currently available to enter"
                icon="▤"
                accent="blue"
              />
              <StatCard
                title="Upcoming Exams"
                value={1}
                description="Exams scheduled for a later time"
                icon="◷"
                accent="amber"
              />
              <StatCard
                title="Completed Exams"
                value="—"
                description="Completed exam statistics will appear here"
                icon="✓"
                accent="green"
              />
            </div>
          </section>

          <section id="exams">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-950">My Exams</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review your exams and their availability.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedExam(null);
                  setIsModalOpen(true);
                }}
                className="rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                + Enter Exam Code
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {exams.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onEnterExam={handleEnterExam}
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <ExamCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleJoinExam}
      />
    </div>
  );
}

export default StudentDashboard;
