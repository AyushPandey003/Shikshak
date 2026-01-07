export interface Review {
    userId: string[];
    id: string;
    author: string;
    initials: string;
    rating: number;
    timeAgo: string;
    content: string;
}

export interface Lecture {
    id: string;
    title: string;
    duration: string;
    isPreview: boolean;
    type: 'video' | 'article' | 'quiz' | 'assignment';
    description?: string;
    contentUrl?: string; // For storing Azure Blob ID or URL
}

export interface Section {
    id: string;
    title: string;
    lectures: Lecture[];
}

export interface Instructor {
    id: string;
    name: string;
    title: string;
    avatar: string;
    rating: number;
    students: number;
    courses: number;
    bio: string;
}

export interface Course {
    id: string;
    title: string;
    subtitle: string;
    category: string[];
    lastUpdated: string;
    language: string;
    rating: number;
    totalRatings: number;
    students: number;
    price: number;
    originalPrice: number;
    discountEnding: string;
    thumbnail: string;
    videoPreview: string;
    whatYouWillLearn: string[];
    requirements: string[];
    description: string;
    sections: Section[];
    instructors: Instructor[];
}