import React from 'react';
import { Course, Review } from '@/types/coursedet';
import { MonitorPlay, FileText, CheckCircle2 } from 'lucide-react';

export const SAMPLE_COURSE: Course = {
    id: "c-201",
    title: "Class 8 Mathematics – Complete Conceptual Course",
    subtitle: "Master Class 8 Maths with clear concepts, solved examples, and exam-focused practice based on NCERT.",
    category: ["CBSE", "Mathematics", "Class 8"],
    lastUpdated: "12/2025",
    language: "English",
    rating: 4.7,
    totalRatings: 324,
    students: 5421,
    price: 399,
    originalPrice: 1999,
    discountEnding: "8 hours",
    thumbnail: "https://picsum.photos/800/450?math",
    videoPreview: "https://picsum.photos/800/450?education",
    whatYouWillLearn: [
        "Understand all Class 8 Maths concepts with clear explanations and visual examples.",
        "Solve numerical problems step-by-step with logical reasoning.",
        "Build strong fundamentals in algebra, geometry, and data handling.",
        "Learn shortcuts and methods to solve problems faster in exams.",
        "Prepare confidently for school exams and competitive foundation tests."
    ],
    requirements: [
        "Basic knowledge of Class 7 Mathematics concepts.",
        "Notebook and pen for regular practice.",
        "Willingness to practice numerical problems consistently."
    ],
    description: `
    <p class="mb-4">
        Mathematics in Class 8 plays a crucial role in building a strong foundation for higher classes.
        Topics like algebraic expressions, linear equations, geometry, and data handling require
        clear conceptual understanding rather than rote learning.
    </p>
    <p class="mb-4">
        This course, <strong>Class 8 Mathematics – Complete Conceptual Course</strong>, is designed
        to help students understand every chapter in a simple, structured, and exam-oriented way.
        Each concept is explained using real-life examples, visuals, and step-by-step problem solving.
    </p>
    <p>
        By the end of this course, students will be confident in solving NCERT problems, examples,
        and additional practice questions required to score well in exams.
    </p>
  `,
    sections: [
        {
            id: "s1",
            title: "Introduction & Course Overview",
            lectures: [
                { id: "l1", title: "How to Study Mathematics Effectively", duration: "05:10", isPreview: true, type: "video" },
                { id: "l2", title: "Syllabus Overview – Class 8 Maths", duration: "04:00", isPreview: false, type: "article" }
            ]
        },
        {
            id: "s2",
            title: "Rational Numbers",
            lectures: [
                { id: "l3", title: "Introduction to Rational Numbers", duration: "12:30", isPreview: false, type: "video" },
                { id: "l4", title: "Operations on Rational Numbers", duration: "18:45", isPreview: false, type: "video" },
                { id: "l5", title: "Solved Examples & Practice Questions", duration: "10:00", isPreview: true, type: "video" }
            ]
        },
        {
            id: "s3",
            title: "Algebraic Expressions & Linear Equations",
            lectures: [
                { id: "l6", title: "Understanding Algebraic Expressions", duration: "15:20", isPreview: false, type: "video" },
                { id: "l7", title: "Solving Linear Equations", duration: "20:10", isPreview: false, type: "video" }
            ]
        },
        {
            id: "s4",
            title: "Geometry & Mensuration",
            lectures: [
                { id: "l8", title: "Understanding Polygons", duration: "14:00", isPreview: false, type: "video" },
                { id: "l9", title: "Area and Perimeter", duration: "22:00", isPreview: false, type: "video" },
                { id: "l10", title: "Chapter Summary & Key Formulas", duration: "06:00", isPreview: false, type: "article" }
            ]
        }
    ],
    instructors: [
        {
            id: "i1",
            name: "Anita Sharma",
            title: "Mathematics Educator (8+ Years Experience)",
            avatar: "https://picsum.photos/200/200?random=2",
            rating: 4.6,
            students: 120345,
            courses: 6,
            bio: "I am a Mathematics educator with over 8 years of experience teaching middle school students. My focus is on building strong fundamentals and helping students overcome fear of maths."
        }
    ]
};

// Static reviews to simulate backend data
export const STATIC_REVIEWS: Review[] = [
    {
        id: "r1",
        author: "Anonymous",
        initials: "RK",
        rating: 5,
        timeAgo: "2 weeks ago",
        content: "Very helpful course. Concepts are explained clearly and the examples made maths easy to understand."
    },
    {
        id: "r2",
        author: "Anonymous",
        initials: "PS",
        rating: 4.5,
        timeAgo: "1 month ago",
        content: "Good explanations and lots of practice questions. Helped me score better in my school tests."
    },
    {
        id: "r3",
        author: "Anonymous",
        initials: "AV",
        rating: 5,
        timeAgo: "5 days ago",
        content: "Earlier I was scared of algebra. After this course, I can solve linear equations confidently."
    },
    {
        id: "r4",
        author: "Anonymous",
        initials: "NP",
        rating: 4,
        timeAgo: "3 weeks ago",
        content: "The geometry section is very good. Diagrams and explanations are simple and clear."
    },
    {
        id: "r5",
        author: "Anonymous",
        initials: "KM",
        rating: 5,
        timeAgo: "1 week ago",
        content: "Best maths course for Class 8 students. Highly recommended for exam preparation."
    }
];

export const ICONS = {
    Video: <MonitorPlay className="w-4 h-4" />,
    Article: <FileText className="w-4 h-4" />,
    Check: <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-1" />
};
