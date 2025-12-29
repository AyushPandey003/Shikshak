Test/Quiz System Implementation Plan
Implement a test/quiz system for courses with models and API routes.

Proposed Changes
Models
[NEW] 
test.model.js
Create Test schema:

{
  questions: [{ type: String }],  // Array of question strings
  course_id: ObjectId,            // Reference to Course
  user_id: String,                // Creator (teacher) ID
  valid_until: Date               // Expiration date
}
[NEW] 
result.model.js
Create Result schema:

{
  test_id: ObjectId,              // Reference to Test
  user_id: String,                // Student ID
  answers: [{ type: String }],    // Array of answers
  marks: Number                   // Score (null until graded)
}
[MODIFY] 
courses.model.js
Add test_id array field to Course schema:

test_id: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Test"
}]
Routes & Controllers
[NEW] 
tests.js
Create routes file with endpoints:

Route	Method	Description
/test-create	POST	Create a new test with questions
/fetch-questions	POST	Get questions for a test
/save-result	POST	Save student answers
/get-results	POST	Get all results for a test (teacher)
/give-marks	POST	Assign marks to a result
/get-student-result	POST	Get results for a specific student
[NEW] 
tests.controllers.js
Implement controller functions:

createTest - Create test, add test_id to course
fetchQuestions - Get test questions by test_id
saveResult - Save student answers for a test
getResults - Get all results for a test (for teacher)
giveMarks - Update marks for a result
getStudentResult - Get student's result for a test
[MODIFY] 
index.js
Register tests routes:

import testsRoutes from "./routes/tests.js";
app.use("/api/tests", testsRoutes);
API Endpoints
POST /api/tests/test-create
Request:

{
  "questions": ["What is React?", "Explain useState"],
  "course_id": "abc123",
  "user_id": "teacher_id",
  "valid_until": "2025-01-15T00:00:00Z"
}
POST /api/tests/fetch-questions
Request: { "test_id": "test_id" }

POST /api/tests/save-result
Request:

{
  "test_id": "test_id",
  "user_id": "student_id",
  "answers": ["React is a library", "useState is a hook"]
}
POST /api/tests/get-results
Request: { "test_id": "test_id" }

POST /api/tests/give-marks
Request:

{
  "result_id": "result_id",
  "marks": 85
}
POST /api/tests/get-student-result
Request: { "test_id": "test_id", "user_id": "student_id" }

Verification Plan
Manual Testing
Since this is a backend service, test using curl or Postman:

Start the Courses service:

cd c:\Users\ayush\Desktop\Shikshak\Backend\Courses
pnpm install
pnpm start
Create a test:

curl -X POST http://localhost:4002/api/tests/test-create \
  -H "Content-Type: application/json" \
  -d '{"questions":["Q1","Q2"],"course_id":"<valid_course_id>","user_id":"teacher1","valid_until":"2025-02-01"}'
Fetch questions:

curl -X POST http://localhost:4002/api/tests/fetch-questions \
  -H "Content-Type: application/json" \
  -d '{"test_id":"<test_id_from_step_2>"}'
Save student result:

curl -X POST http://localhost:4002/api/tests/save-result \
  -H "Content-Type: application/json" \
  -d '{"test_id":"<test_id>","user_id":"student1","answers":["A1","A2"]}'
Get all results (teacher view):

curl -X POST http://localhost:4002/api/tests/get-results \
  -H "Content-Type: application/json" \
  -d '{"test_id":"<test_id>"}'
Give marks:

curl -X POST http://localhost:4002/api/tests/give-marks \
  -H "Content-Type: application/json" \
  -d '{"result_id":"<result_id>","marks":90}'
Get student result:

curl -X POST http://localhost:4002/api/tests/get-student-result \
  -H "Content-Type: application/json" \
  -d '{"test_id":"<test_id>","user_id":"student1"}'
NOTE

You'll need a valid course_id from your database to test the create endpoint. The test_id from step 2 should be used in subsequent steps.

