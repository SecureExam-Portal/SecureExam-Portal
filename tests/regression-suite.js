/**
 * Comprehensive Regression Test Suite for SecureExam Portal
 * Tests all backend APIs, proctoring service, and end-to-end user workflows
 */

const BASE_URL = 'http://localhost:5000/api';
const PROCTORING_URL = 'http://localhost:5001';

let adminToken = '';
let studentToken = '';
let createdExamId = '';
let createdQuestionId = '';
let privateExamId = '';
let privateExamCode = '';
let submittedResultId = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { status: response.status, data, headers: response.headers };
}

async function runRegressionSuite() {
  console.log('\n======================================================');
  console.log('   SECUREEXAM PORTAL - REGRESSION TEST SUITE');
  console.log('======================================================\n');

  // --- 1. HEALTH & SERVICES ---
  console.log('--- 1. Service Health Checks ---');
  try {
    const rootRes = await fetch('http://localhost:5000/');
    const rootText = await rootRes.text();
    assert(rootRes.status === 200 && rootText.includes('SecureExam AI Backend Running'), 'Node.js Backend root running');

    const procRes = await request(`${PROCTORING_URL}/health`);
    assert(procRes.status === 200 && procRes.data.status === 'healthy', 'FastAPI AI Proctoring health check healthy');

    const violationsRes = await request(`${PROCTORING_URL}/violations`);
    assert(violationsRes.status === 200 && typeof violationsRes.data.count === 'number', 'AI Proctoring violations API accessible');
  } catch (err) {
    assert(false, `Health checks failed: ${err.message}`);
  }

  // --- 2. AUTHENTICATION & RBAC ---
  console.log('\n--- 2. Authentication & Authorization (RBAC) ---');
  try {
    // Student Login
    const studentLogin = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: 'student@secureexam.local', password: 'Password123!' },
    });
    assert(studentLogin.status === 200 && studentLogin.data.token, 'Student can login successfully');
    studentToken = studentLogin.data.token;
    assert(studentLogin.data.user.role === 'student', 'Student role correctly returned');

    // Admin Login
    const adminLogin = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: 'admin@secureexam.local', password: 'Password123!' },
    });
    assert(adminLogin.status === 200 && adminLogin.data.token, 'Admin can login successfully');
    adminToken = adminLogin.data.token;
    assert(adminLogin.data.user.role === 'admin', 'Admin role correctly returned');

    // Invalid Login credentials
    const badLogin = await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: { email: 'student@secureexam.local', password: 'WrongPassword' },
    });
    assert(badLogin.status === 401, 'Invalid password is rejected with 401');

    // Protected Route without token
    const noToken = await request(`${BASE_URL}/auth/me`);
    assert(noToken.status === 401, 'Protected route rejects unauthenticated request');

    // Current user info (me)
    const meRes = await request(`${BASE_URL}/auth/me`, { token: studentToken });
    assert(meRes.status === 200 && meRes.data.user.email === 'student@secureexam.local', 'GET /api/auth/me returns current user info');

    // Admin endpoint RBAC access denial for Student
    const rbacDenial = await request(`${BASE_URL}/admin/stats`, { token: studentToken });
    assert(rbacDenial.status === 403, 'Student is forbidden (403) from accessing admin stats');

    // Admin endpoint RBAC access allow for Admin
    const rbacAllow = await request(`${BASE_URL}/admin/stats`, { token: adminToken });
    assert(rbacAllow.status === 200 && typeof rbacAllow.data.totalStudents === 'number', 'Admin has full access to admin stats');
  } catch (err) {
    assert(false, `Authentication suite error: ${err.message}`);
  }

  // --- 3. USER PROFILE & SETTINGS ---
  console.log('\n--- 3. User Profile & Password Updates ---');
  try {
    // Get profile
    const prof = await request(`${BASE_URL}/users/profile`, { token: studentToken });
    assert(prof.status === 200 && prof.data.user.email === 'student@secureexam.local', 'GET /api/users/profile returns profile');

    // Update profile
    const updateProf = await request(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      token: studentToken,
      body: { name: 'Student Updated' },
    });
    assert(updateProf.status === 200 && updateProf.data.user.name === 'Student Updated', 'PUT /api/users/profile updates user name');

    // Revert profile name
    await request(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      token: studentToken,
      body: { name: 'Student Test' },
    });
  } catch (err) {
    assert(false, `User profile suite error: ${err.message}`);
  }

  // --- 4. EXAM LIFECYCLE (ADMIN) ---
  console.log('\n--- 4. Exam Management Lifecycle ---');
  try {
    // Admin creates Public Exam
    const examRes = await request(`${BASE_URL}/exams/create`, {
      method: 'POST',
      token: adminToken,
      body: {
        title: 'Full Regression Exam - Public',
        description: 'Comprehensive test exam',
        duration: 45,
        accessType: 'public',
        allowReattempt: true,
        maxAttempts: 2,
      },
    });
    assert(examRes.status === 201 && examRes.data._id, 'Admin can create public exam');
    createdExamId = examRes.data._id;
    assert(examRes.data.accessType === 'public', 'Public exam accessType is public');

    // Admin creates Private Exam (with auto-generated exam code)
    const privExamRes = await request(`${BASE_URL}/exams/create`, {
      method: 'POST',
      token: adminToken,
      body: {
        title: 'Private Coding Challenge',
        description: 'Requires pass code',
        duration: 30,
        accessType: 'private',
      },
    });
    assert(privExamRes.status === 201 && privExamRes.data.examCode, 'Private exam created with unique exam code');
    privateExamId = privExamRes.data._id;
    privateExamCode = privExamRes.data.examCode;

    // Student attempts to create exam (should be denied)
    const studentCreate = await request(`${BASE_URL}/exams/create`, {
      method: 'POST',
      token: studentToken,
      body: { title: 'Hacked Exam', duration: 10 },
    });
    assert(studentCreate.status === 403, 'Student cannot create exams (Admin only)');

    // Add Question 1 to Exam
    const q1Res = await request(`${BASE_URL}/exams/question/add`, {
      method: 'POST',
      token: adminToken,
      body: {
        examId: createdExamId,
        questionText: 'What does REST stand for?',
        options: [
          'Representational State Transfer',
          'Real Elastic System Transfer',
          'Reliable Entity State Tool',
          'Remote Execution Server Task',
        ],
        correctAnswer: 'Representational State Transfer',
        marks: 2,
      },
    });
    assert(q1Res.status === 201 && q1Res.data._id, 'Admin can add Question 1 to exam');
    createdQuestionId = q1Res.data._id;

    // Add Question 2 to Exam
    const q2Res = await request(`${BASE_URL}/exams/question/add`, {
      method: 'POST',
      token: adminToken,
      body: {
        examId: createdExamId,
        questionText: 'Which protocol is secured with TLS/SSL?',
        options: ['HTTP', 'HTTPS', 'FTP', 'Telnet'],
        correctAnswer: 'HTTPS',
        marks: 3,
      },
    });
    assert(q2Res.status === 201 && q2Res.data._id, 'Admin can add Question 2 to exam');

    // Fetch all exams
    const allExams = await request(`${BASE_URL}/exams/all`, { token: studentToken });
    assert(allExams.status === 200 && Array.isArray(allExams.data), 'GET /api/exams/all retrieves exam list');
    const foundExam = allExams.data.find(e => e._id === createdExamId);
    assert(foundExam && foundExam.questionCount === 2, 'Exam list accurately computes questionCount (2)');

    // Fetch exam details by ID
    const examDetail = await request(`${BASE_URL}/exams/details/${createdExamId}`, { token: studentToken });
    assert(examDetail.status === 200 && examDetail.data.title === 'Full Regression Exam - Public', 'GET /api/exams/details/:id returns exam details');

    // Fetch questions by exam ID
    const questionsRes = await request(`${BASE_URL}/exams/questions/${createdExamId}`, { token: studentToken });
    assert(questionsRes.status === 200 && questionsRes.data.length === 2, 'GET /api/exams/questions/:id retrieves all exam questions');

    // Admin updates exam
    const updateExamRes = await request(`${BASE_URL}/exams/${createdExamId}`, {
      method: 'PUT',
      token: adminToken,
      body: { title: 'Full Regression Exam - Updated' },
    });
    assert(updateExamRes.status === 200 && updateExamRes.data.title === 'Full Regression Exam - Updated', 'PUT /api/exams/:id updates exam metadata');
  } catch (err) {
    assert(false, `Exam management error: ${err.message}`);
  }

  // --- 5. EXAM SUBMISSION & GRADING ---
  console.log('\n--- 5. Exam Submission, Auto-Grading & Reattempts ---');
  try {
    // Fetch questions again to get exact question IDs
    const qList = (await request(`${BASE_URL}/exams/questions/${createdExamId}`, { token: studentToken })).data;
    const q1 = qList.find(q => q.questionText.includes('REST'));
    const q2 = qList.find(q => q.questionText.includes('TLS/SSL'));

    // Submit Attempt 1: 1 correct answer (Q1), 1 incorrect answer (Q2)
    // Total marks = 2 + 3 = 5. Q1 correct = 2 marks. Percentage = (2 / 5) * 100 = 40%
    const submitRes = await request(`${BASE_URL}/exams/submit`, {
      method: 'POST',
      token: studentToken,
      body: {
        examId: createdExamId,
        answers: [
          { questionId: q1._id, selectedAnswer: 'Representational State Transfer' }, // Correct (+2)
          { questionId: q2._id, selectedAnswer: 'HTTP' }, // Incorrect (+0)
        ],
        timeTaken: 120,
        violations: 1,
      },
    });

    assert(submitRes.status === 200, 'Student can submit exam');
    assert(submitRes.data.score === 2, 'Auto-grading score calculated correctly (2/5 marks)');
    assert(submitRes.data.percentage === 40, 'Percentage calculated correctly (40%)');
    submittedResultId = submitRes.data.result._id;

    // Student views "My Results"
    const myResults = await request(`${BASE_URL}/results/my`, { token: studentToken });
    assert(myResults.status === 200 && myResults.data.length >= 1, 'GET /api/results/my returns student past results');

    // Student views specific result by ID
    const singleResult = await request(`${BASE_URL}/results/${submittedResultId}`, { token: studentToken });
    assert(singleResult.status === 200 && singleResult.data.score === 2, 'GET /api/results/:id returns result with breakdown');
    assert(Array.isArray(singleResult.data.questions), 'Result detail includes question breakdown');

    // Submit Attempt 2 (Allowed because maxAttempts = 2)
    const attempt2Res = await request(`${BASE_URL}/exams/submit`, {
      method: 'POST',
      token: studentToken,
      body: {
        examId: createdExamId,
        answers: [
          { questionId: q1._id, selectedAnswer: 'Representational State Transfer' },
          { questionId: q2._id, selectedAnswer: 'HTTPS' }, // Correct (+3) -> total 5/5
        ],
        timeTaken: 95,
        violations: 0,
      },
    });
    assert(attempt2Res.status === 200 && attempt2Res.data.score === 5, 'Second attempt allowed and scored 5/5 (100%)');

    // Attempt 3 (Should be BLOCKED because maxAttempts = 2)
    const attempt3Res = await request(`${BASE_URL}/exams/submit`, {
      method: 'POST',
      token: studentToken,
      body: {
        examId: createdExamId,
        answers: [],
      },
    });
    assert(attempt3Res.status === 400 && attempt3Res.data.message.includes('Maximum attempts'), 'Third attempt properly blocked with 400 Max Attempts Reached');
  } catch (err) {
    assert(false, `Exam submission error: ${err.message}`);
  }

  // --- 6. ADMIN RESULTS & EXPORT ---
  console.log('\n--- 6. Admin Results & Excel Export ---');
  try {
    // Admin gets all results
    const allResults = await request(`${BASE_URL}/results`, { token: adminToken });
    assert(allResults.status === 200 && allResults.data.length >= 2, 'GET /api/results returns all system results to admin');

    // Admin gets results by exam ID
    const examResults = await request(`${BASE_URL}/results/exam/${createdExamId}`, { token: adminToken });
    assert(examResults.status === 200 && examResults.data.length === 2, 'GET /api/results/exam/:examId filters results by exam');

    // Admin exports results to Excel
    const exportRes = await fetch(`${BASE_URL}/export/excel/${createdExamId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(exportRes.status === 200, 'Excel export endpoint responds with 200 OK');
    const contentType = exportRes.headers.get('content-type');
    assert(contentType && contentType.includes('spreadsheetml'), 'Excel export returns valid OpenXML spreadsheet content type');
    const buffer = await exportRes.arrayBuffer();
    assert(buffer.byteLength > 1000, `Excel file generated successfully (${buffer.byteLength} bytes)`);
  } catch (err) {
    assert(false, `Results and export error: ${err.message}`);
  }

  // --- 7. CLEANUP & EXAM DELETION CASCADE ---
  console.log('\n--- 7. Cleanup & Cascade Deletions ---');
  try {
    // Delete private exam
    const delPriv = await request(`${BASE_URL}/exams/${privateExamId}`, {
      method: 'DELETE',
      token: adminToken,
    });
    assert(delPriv.status === 200, 'Admin can delete exam');

    // Verify questions cascade deleted
    const verifyQ = await request(`${BASE_URL}/exams/questions/${privateExamId}`, { token: adminToken });
    assert(verifyQ.status === 200 && verifyQ.data.length === 0, 'Deleted exam questions are cleaned up');
  } catch (err) {
    assert(false, `Cleanup error: ${err.message}`);
  }

  // --- SUMMARY ---
  console.log('\n======================================================');
  console.log(`   TEST RUN COMPLETED`);
  console.log(`   Total:  ${totalTests}`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${failedTests}`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runRegressionSuite().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

