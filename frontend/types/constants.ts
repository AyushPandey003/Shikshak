import { Course } from '@/types/course';

export const CLASSES = [
  "6th Class", "7th Class", "8th Class", "9th Class", "10th Class", "11th Class", "12th Class"
];

export const BOARDS = [
  "CBSE", "ICSE", "State Board"
];

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Science",
  "History",
  "Geography",
  "Computer Science",
  "Economics",
  "Accountancy",
  "Business Studies"
];


export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Complete Class 10 Mathematics (Board + Olympiad)',
    instructor: {
      id: 'i1',
      name: 'R.K. Gupta Sir',
      avatar: 'https://picsum.photos/seed/rkgupta/50/50'
    },
    price: 1499,
    rating: 4.9,
    students: 18250,
    image: 'https://picsum.photos/seed/math10/400/300',
    subject: 'Mathematics',
    grade: '10th Class',
    board: 'CBSE',
    tags: ['Best Seller'],
    isBundle: false,
    type: "Public"
  },
  {
    id: '2',
    title: 'Physics Class 9 – Concepts, Numericals & Experiments',
    instructor: {
      id: 'i2',
      name: 'Amit Verma',
      avatar: 'https://picsum.photos/seed/amitverma/50/50'
    },
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    students: 12400,
    image: 'https://picsum.photos/seed/phy9/400/300',
    subject: 'Physics',
    grade: '9th Class',
    board: 'ICSE',
    tags: ['Top Rated'],
    isBundle: false,
    type: "Public"
  },
  {
    id: '3',
    title: 'Organic Chemistry – Class 12 (JEE + Boards)',
    instructor: {
      id: 'i3',
      name: 'Dr. Ankit Mishra',
      avatar: 'https://picsum.photos/seed/ankitmishra/50/50'
    },
    price: 0,
    rating: 4.7,
    students: 32000,
    image: 'https://picsum.photos/seed/chem12/400/300',
    subject: 'Chemistry',
    grade: '12th Class',
    board: 'CBSE',
    tags: ['Free'],
    isBundle: false,
    type: "Public"
  },
  {
    id: '4',
    title: 'Biology Mega Bundle – Class 11 (NEET Foundation)',
    instructor: {
      id: 'i4',
      name: 'Neha Sharma',
      avatar: 'https://picsum.photos/seed/nehasharma/50/50'
    },
    price: 2799,
    rating: 4.8,
    students: 9500,
    image: 'https://picsum.photos/seed/bio11/400/300',
    subject: 'Biology',
    grade: '11th Class',
    board: 'CBSE',
    tags: ['Bundle'],
    isBundle: true,
    type: "Public"
  },
  {
    id: '5',
    title: 'English Grammar & Writing Skills – Class 8',
    instructor: {
      id: 'i5',
      name: 'Pooja Ma’am',
      avatar: 'https://picsum.photos/seed/pooja/50/50'
    },
    price: 499,
    rating: 4.9,
    students: 21000,
    image: 'https://picsum.photos/seed/eng8/400/300',
    subject: 'English',
    grade: '8th Class',
    board: 'State Board',
    tags: ['Best Seller'],
    isBundle: false,
    type: "Public"
  },
  {
    id: '6',
    title: 'Computer Science – Python for Class 11',
    instructor: {
      id: 'i6',
      name: 'Rohit Negi',
      avatar: 'https://picsum.photos/seed/rohitnegi/50/50'
    },
    price: 799,
    rating: 4.6,
    students: 8600,
    image: 'https://picsum.photos/seed/cs11/400/300',
    subject: 'Computer Science',
    grade: '11th Class',
    board: 'CBSE',
    tags: ['Trending'],
    isBundle: false,
    type: "Public"
  },
  {
    id: '7',
    title: 'Social Science Complete Course – Class 10',
    instructor: {
      id: 'i7',
      name: 'Sunita Rajput',
      avatar: 'https://picsum.photos/seed/sunitarajput/50/50'
    },
    price: 1199,
    rating: 4.7,
    students: 14500,
    image: 'https://picsum.photos/seed/sst10/400/300',
    subject: 'Social Science',
    grade: '10th Class',
    board: 'CBSE',
    tags: ['Bundle'],
    isBundle: true,
    type: "Public"
  },
  {
    id: '8',
    title: 'Accountancy Basics – Class 12 Commerce',
    instructor: {
      id: 'i8',
      name: 'CA Rakesh Jain',
      avatar: 'https://picsum.photos/seed/rakeshjain/50/50'
    },
    price: 1599,
    rating: 4.5,
    students: 7800,
    image: 'https://picsum.photos/seed/acc12/400/300',
    subject: 'Accountancy',
    grade: '12th Class',
    board: 'CBSE',
    tags: ['Best Seller'],
    isBundle: false,
    type: "Public"
  }
];


