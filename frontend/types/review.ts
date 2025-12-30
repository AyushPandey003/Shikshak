export interface Review {
  userId?: string;
  courseId: string;
  rating: number; // 1 to 5
  description: string;
  isAnonymous?: boolean;
}
