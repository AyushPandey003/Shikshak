"use client";

import CourseCard from "@/components/ui/CourseCard";
import { Course } from "@/types/course";
import { useState } from "react";

type Option = "All" | "Public" | "Private" | "Draft";

export default function Page() {
  const [activeTab, setActiveTab] = useState<Option>("Public");

  const myCourse: Course[] = [
    {
      id: "1",
      title: "My Course — Mathematics Essentials",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 499,
      rating: 4.8,
      students: 1200,
      image: "https://picsum.photos/seed/mycourse1/400/300",
      subject: "Mathematics",
      grade: "10th Class",
      board: "CBSE",
      tags: ["My Course"],
      isBundle: false,
      type: "Public",
    },
    {
      id: "2",
      title: "My Course — Physics Fundamentals",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 0,
      rating: 4.7,
      students: 3400,
      image: "https://picsum.photos/seed/mycourse2/400/300",
      subject: "Physics",
      grade: "9th Class",
      board: "ICSE",
      tags: ["Free"],
      isBundle: false,
      type: "Public",
    },
    {
      id: "3",
      title: "My Course — English Communication",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 299,
      rating: 4.5,
      students: 800,
      image: "https://picsum.photos/seed/mycourse3/400/300",
      subject: "English",
      grade: "8th Class",
      board: "State Board",
      tags: [],
      isBundle: false,
      type: "Public",
    },
    {
      id: "4",
      title: "My Course — Advanced Algebra (Private)",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 799,
      rating: 4.9,
      students: 420,
      image: "https://picsum.photos/seed/mycourse4/400/300",
      subject: "Mathematics",
      grade: "11th Class",
      board: "CBSE",
      tags: ["Advanced"],
      isBundle: false,
      type: "Private",
    },
    {
      id: "5",
      title: "My Course — Chemistry Lab Practice (Private)",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 1299,
      rating: 4.6,
      students: 210,
      image: "https://picsum.photos/seed/mycourse5/400/300",
      subject: "Chemistry",
      grade: "12th Class",
      board: "CBSE",
      tags: ["Lab"],
      isBundle: false,
      type: "Private",
    },
    {
      id: "6",
      title: "My Course — Draft: Economics Intro",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 0,
      rating: 0,
      students: 0,
      image: "https://picsum.photos/seed/mycourse6/400/300",
      subject: "Economics",
      grade: "12th Class",
      board: "CBSE",
      tags: [],
      isBundle: false,
      type: "Draft",
    },
    {
      id: "7",
      title: "My Course — Draft: Biology Notes",
      instructor: {
        id: "mi1",
        name: "My Courses Instructor",
        avatar: "https://picsum.photos/seed/myinstructor/50/50",
      },
      price: 0,
      rating: 0,
      students: 0,
      image: "https://picsum.photos/seed/mycourse7/400/300",
      subject: "Biology",
      grade: "11th Class",
      board: "CBSE",
      tags: ["Draft"],
      isBundle: false,
      type: "Draft",
    },
  ];

  const tabs: Option[] = ["All", "Public", "Private", "Draft"];
  const filteredCourses =
    activeTab === "All"
      ? myCourse
      : myCourse.filter((c) => c.type === activeTab);

  return (
    <div className="w-full h-full pt-2 px-5">
      <div className="w-full h-full flex flex-col ">
        <div className="pb-5 w-full">
          <h1 className="text-3xl font-bold pb-2">My courses</h1>
          <div className="flex items-center justify-between w-full bg-white pr-5 py-1">
            <div className="flex items-center gap-1 sm:w-auto overflow-x-auto no-scrollbar sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap w-fit ${
                    activeTab === tab
                      ? "text-indigo-600 bg-white shadow-md"
                      : "text-gray-500 hover:text-brand-500 hover:bg-gray-50"
                  }`}
                >
                  {tab == "All" ? "All" : tab}
                </button>
              ))}
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-semibold">{filteredCourses.length} Results</div>
            </div>
          </div>
        </div>
        {filteredCourses.length === 0 ? (
          <div className="w-full py-10 text-center text-gray-500">
            No courses in {activeTab} tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {/* cards */}
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
