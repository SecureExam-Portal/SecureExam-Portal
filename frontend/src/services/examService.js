        
import API from "./api";

// Fetch all exams
export const getExams = async () => {
  const response = await API.get("/exams/all");
  return response.data;
};

// Alias for backwards-compatibility
export const getAllExams = getExams;

// Fetch a single exam by its ID.
export const getExamById = async (examId) => {
  const response = await API.get(`/exams/details/${examId}`);
  return response.data;
};

// Join an exam using its exam code.
export const joinExam = async (examCode) => {
  const response = await API.post("/exams/join", { examCode });
  return response.data;
};

// Fetch questions for an exam
export const getQuestionsByExam = async (examId) => {
  const response = await API.get(`/exams/questions/${examId}`);
  return response.data;
};

// Submit student answers for an exam
export const submitExam = async (submissionData) => {
  const response = await API.post("/exams/submit", submissionData);
  return response.data;
};

export default {
  getExams,
  getAllExams,
  getExamById,
  joinExam,
  getQuestionsByExam,
  submitExam,
};
