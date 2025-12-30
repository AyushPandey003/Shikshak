export interface Instructor {
  id: string;
  name: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: Instructor;
  price: number;
  originalPrice?: number; // For strikethrough
  rating: number;
  totalRatings?: number;
  students: number;
  image: string;
  description?: string;
  course_outcomes?: string;
  language?: string;
  duration?: string;
  visibility?: string;

  // New Fields
  subject: string;      // e.g., Mathematics
  grade: string;        // e.g., 10th Class
  board: string;        // e.g., CBSE

  tags: string[]; // e.g. "Best Seller", "Bundle"
  isBundle?: boolean;
  type?: string;
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating';

export type TabOption = 'All' | 'Paid' | 'Sale' | 'Free' | 'Bundle';