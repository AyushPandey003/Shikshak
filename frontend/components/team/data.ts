export interface TeamMember {
  id: number;
  name: string;
  title: string;
  image: string;
  tags: string[];
  bio: string;
  stats: {
    yearsInPractice: number;
    rating: number;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ayush Pandey",
    title: "Lead Frontend Engineer",
    image: "",
    tags: ["FRONTEND", "UI/UX"],
    bio: "Ayush is a visionary frontend architect who crafts seamless user experiences. He specializes in React, Next.js, and modern CSS to build intuitive educational interfaces.",
    stats: {
      yearsInPractice: 5,
      rating: 4.9,
    },
  },
  {
    id: 2,
    name: "Riki K.",
    title: "Backend Architect",
    image: "",
    tags: ["BACKEND", "SYSTEMS"],
    bio: "Riki designs the robust infrastructure that powers Shikshak. With deep expertise in distributed systems and database optimization, he ensures the platform scales effortlessly.",
    stats: {
      yearsInPractice: 6,
      rating: 4.8,
    },
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    title: "AI Researcher",
    image: "",
    tags: ["AI", "ML"],
    bio: "Sarah leads our AI initiatives, developing personalized learning algorithms. She is passionate about using machine learning to make education accessible to everyone.",
    stats: {
      yearsInPractice: 4,
      rating: 4.9,
    },
  },
  {
    id: 4,
    name: "David Chen",
    title: "Product Manager",
    image: "",
    tags: ["PRODUCT", "STRATEGY"],
    bio: "David bridges the gap between technology and user needs. He works closely with educators and students to define the roadmap for Shikshak's future features.",
    stats: {
      yearsInPractice: 8,
      rating: 4.7,
    },
  },
];
