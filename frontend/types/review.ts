export interface Review {
  userId?: string;
  courseId: string;
  rating: number; // 1 to 5
  description: string;
  id?: string;
  date?: string;
  isAnonymous?: boolean;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    courseId: 'course_123',
    rating: 5,
    description: "This course was absolutely amazing! The instructor explained everything clearly.",
    date: "2024-03-15",
    isAnonymous: false
  },
  {
    id: '2',
    courseId: 'course_123',
    rating: 4,
    description: "Great content, but the audio quality could be improved in some sections.",
    date: "2024-02-20",
    isAnonymous: true
  },
  {
    id: '3',
    courseId: 'course_123',
    rating: 5,
    description: "Helped me understand the core concepts. Highly recommended for beginners.",
    date: "2024-01-10",
    isAnonymous: false
  }
];
