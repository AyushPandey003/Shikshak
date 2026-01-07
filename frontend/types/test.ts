export interface Test {
    id: string;
    title: string;
    duration: string;
    questions: number;
    totalMarks: number;
    status: 'unattempted' | 'attempted' | 'completed' | 'expired';
    obtainedMarks?: number;
}

export interface Question {
    id: string;
    text: string;
    maxMarks: number;
}

export interface Answer {
    questionId: string;
    answerText: string;
    obtainedMarks?: number;
}

export interface StudentSubmission {
    studentId: string;
    studentName: string;
    testId: string;
    answers: Answer[];
}

export const dummyTests: Test[] = [
    {
        id: 'test-1',
        title: 'Test 1: Basics Fundamentals',
        duration: '30 mins',
        questions: 15,
        totalMarks: 30,
        status: 'unattempted'
    },
    {
        id: 'test-2',
        title: 'Test 2: Intermediate Concepts',
        duration: '45 mins',
        questions: 25,
        totalMarks: 50,
        status: 'unattempted'
    },
    {
        id: 'test-3',
        title: 'Test 3: Advanced Application',
        duration: '60 mins',
        questions: 30,
        totalMarks: 60,
        status: 'attempted'
    },
    {
        id: 'test-4',
        title: 'Test 4: Expert Systems',
        duration: '90 mins',
        questions: 10,
        totalMarks: 100,
        status: 'completed'
    }
];

export const dummyQuestions: Record<string, Question[]> = {
    'test-1': [
        { id: 'q1', text: 'What is the capital of France?', maxMarks: 2 },
        { id: 'q2', text: 'Explain the concept of gravity.', maxMarks: 5 },
        { id: 'q3', text: 'Solve: 2 + 2 * 4', maxMarks: 3 },
    ],
    'test-2': [
        { id: 'q1', text: 'Describe the water cycle.', maxMarks: 10 },
        { id: 'q2', text: 'Who wrote Romeo and Juliet?', maxMarks: 5 },
    ]
};

export const dummySubmissions: StudentSubmission[] = [
    {
        studentId: 'std-1',
        studentName: 'Alice Johnson',
        testId: 'test-1',
        answers: [
            { questionId: 'q1', answerText: 'Paris', obtainedMarks: 2 },
            { questionId: 'q2', answerText: 'Gravity is a force that pulls things down.', obtainedMarks: 3 },
            { questionId: 'q3', answerText: '10', obtainedMarks: 3 },
        ]
    },
    {
        studentId: 'std-2',
        studentName: 'Bob Smith',
        testId: 'test-1',
        answers: [
            { questionId: 'q1', answerText: 'London', obtainedMarks: 0 },
            { questionId: 'q2', answerText: 'It is a force.', obtainedMarks: 2 },
            { questionId: 'q3', answerText: '10', obtainedMarks: 3 },
        ]
    },
    {
        studentId: 'std-3',
        studentName: 'Charlie Brown',
        testId: 'test-1',
        answers: [
            { questionId: 'q1', answerText: 'Paris', obtainedMarks: 2 },
            { questionId: 'q2', answerText: 'Gravity is the curvature of spacetime.', obtainedMarks: 5 },
            { questionId: 'q3', answerText: '8', obtainedMarks: 0 },
        ]
    }
];
