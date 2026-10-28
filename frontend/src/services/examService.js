        
import API from "./api";

// Fetch exams for the student dashboard.
export const getExams = async () => {
  const response = await API.get("/exams");
  return response.data;
};

// Fetch a single exam by its ID.
export const getExamById = async (examId) => {
  const response = await API.get(`/exams/${examId}`);
  return response.data;
};

// Join an exam using its exam code.
export const joinExam = async (examCode) => {
  const response = await API.post("/exams/join", { examCode });
  return response.data;
};

export default {
  getExams,
  getExamById,
  joinExam,
};
