// Define the available roles
export enum UserRole {
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
    PARENT = 'PARENT',
}

// Basic auth info returned from Google (simulated)
export interface AuthUser {
    id: string;
    email: string;
    accessToken: string;
    photoUrl?: string;
}

// Common fields for all users
export interface BaseProfile {
    id: string;
    name: string;
    phoneNumber: string;
}

// Specific fields for Teachers
export interface TeacherProfile {
    subjects: string[];
    qualifications: string[];
    experiences: string; // Years or description
    classes: string[]; // Grades they teach
}

// Specific fields for Students
export interface StudentProfile {
    classGrade: string;
    coursesEnrolled: string[];
}

// Specific fields for Parents
export interface ParentProfile {
    referId: string;
}

// Combined Profile Type
export interface UserProfile extends BaseProfile {
    role: UserRole;
    teacherDetails?: TeacherProfile;
    studentDetails?: StudentProfile;
    parentDetails?: ParentProfile;
}