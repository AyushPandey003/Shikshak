// Centralized API configuration
// All API calls should use this configuration instead of hardcoded localhost URLs

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:4000';

export const API_CONFIG = {
    baseUrl: API_GATEWAY_URL,

    // Authentication endpoints
    auth: {
        getUser: `${API_GATEWAY_URL}/authentication/get_user`,
        userDetail: `${API_GATEWAY_URL}/authentication/user_detail`,
        signInSocial: `${API_GATEWAY_URL}/authentication/sign-in/social`,
    },

    // Material/Courses endpoints
    material: {
        upload: `${API_GATEWAY_URL}/material/upload`,
        courses: {
            base: `${API_GATEWAY_URL}/material/courses`,
            getAll: `${API_GATEWAY_URL}/material/courses/get_all`,
            getAllGeneral: `${API_GATEWAY_URL}/material/courses/get_all_general`,
            getCourseById: `${API_GATEWAY_URL}/material/courses/get_course_by_id`,
            getCourseByIdGeneral: `${API_GATEWAY_URL}/material/courses/get_course_by_id_general`,
            createCourse: `${API_GATEWAY_URL}/material/courses/create_course`,
            editCourse: `${API_GATEWAY_URL}/material/courses/edit_course`,
            deleteCourse: `${API_GATEWAY_URL}/material/courses/delete_course`,
        },
        module: {
            base: `${API_GATEWAY_URL}/material/module`,
            getAll: `${API_GATEWAY_URL}/material/module/get_all_module`,
        },
        reviews: {
            getReviews: `${API_GATEWAY_URL}/material/reviews/get_reviews`,
            createReview: `${API_GATEWAY_URL}/material/reviews/create_review`,
            deleteReview: `${API_GATEWAY_URL}/material/reviews/delete_review`,
        },
        tests: {
            aitest: `${API_GATEWAY_URL}/material/tests/aitest`,
            testCreate: `${API_GATEWAY_URL}/material/tests/test-create`,
            fetchQuestions: `${API_GATEWAY_URL}/material/tests/fetch-questions`,
            saveResult: `${API_GATEWAY_URL}/material/tests/save-result`,
            getResults: `${API_GATEWAY_URL}/material/tests/get-results`,
            getStudentResult: `${API_GATEWAY_URL}/material/tests/get-student-result`,
            giveMarks: `${API_GATEWAY_URL}/material/tests/give-marks`,
        },
    },

    // RAG endpoints
    rag: {
        query: `${API_GATEWAY_URL}/rag/query`,
        ingest: `${API_GATEWAY_URL}/rag/ingest`,
        health: `${API_GATEWAY_URL}/rag/health`,
    },

    // Payment endpoints
    payment: {
        createOrder: `${API_GATEWAY_URL}/payment/create-order`,
        completePayment: `${API_GATEWAY_URL}/payment/complete-payment`,
    },

    // Helper function to get upload URL with file path
    getUploadUrl: (filePath: string) => `${API_GATEWAY_URL}/material/upload/${encodeURIComponent(filePath)}`,
};

export default API_CONFIG;
