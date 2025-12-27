'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import CourseCard from '@/components/ui/CourseCard';
import FilterBar from '@/components/layout/FilterBar';
import { CLASSES, BOARDS, SUBJECTS } from '@/constants/allcourses';
import { TabOption, SortOption, Course } from '@/types/course';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

interface FilterState {
  grades: string[];
  boards: string[];
  subjects: string[];
}

export default function CoursesPage() {
  const { user } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabOption>('All');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    grades: [],
    boards: [],
    subjects: []
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/material/courses/get_all_general",
          {
            withCredentials: true,
          }
        );

        console.log("received", res.data);
        let fetchedData: any[] = [];
        if (Array.isArray(res.data)) {
          fetchedData = res.data;
        } else if (res.data && Array.isArray(res.data.courses)) {
          fetchedData = res.data.courses;
        } else {
          console.error("Unexpected data format:", res.data);
          fetchedData = [];
        }

        const mappedCourses: Course[] = await Promise.all(fetchedData.map(async (c: any) => {
          let imageUrl = "https://picsum.photos/300/200";

          // If thumbnail is a blob name (doesn't start with http), fetch SAS URL
          if (c.thumbnail && !c.thumbnail.startsWith("http")) {
            try {
              // Use encodeURIComponent to handle spaces or special chars safe
              const sasRes = await axios.get(`http://localhost:4000/material/upload/${encodeURIComponent(c.thumbnail)}`, {
                headers: user?.accessToken ? { "Authorization": `Bearer ${user.accessToken}` } : {},
                withCredentials: true
              });
              if (sasRes.data && sasRes.data.url) {
                imageUrl = sasRes.data.url;
              }
            } catch (err: any) {
              console.error(`Failed to fetch SAS for ${c.thumbnail}:`, err);
            }
          } else if (c.thumbnail) {
            imageUrl = c.thumbnail;
          }

          return {
            id: c._id || c.id,
            title: c.name || "Untitled Course",
            instructor: {
              id: c.teacher_details?.id || 'inst-1',
              name: c.teacher_details?.name || 'Instructor',
              avatar: c.teacher_details?.avatar || 'https://ui-avatars.com/api/?name=Instructor'
            },
            price: c.price || 0,
            originalPrice: c.price || 0,
            rating: c.rating || 4.5,
            students: c.students_count || 0,
            image: imageUrl,
            subject: c.subject || "General",
            grade: c.class || c.grade || "General", // Backend data might be missing this
            board: c.board || "CBSE",
            tags: [],
            isBundle: c.isBundle || false
          };
        }));

        setCourses(mappedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Use hardcoded options
  const availableClasses = CLASSES;
  const availableBoards = BOARDS;
  const availableSubjects = SUBJECTS;


  const [sortOption, setSortOption] = useState<SortOption>('relevance');

  const toggleFilter = useCallback((type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentList = prev[type];
      const isSelected = currentList.includes(value);

      return {
        ...prev,
        [type]: isSelected
          ? currentList.filter(item => item !== value)
          : [...currentList, value]
      };
    });
  }, []);

  const removeFilter = useCallback((type: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ grades: [], boards: [], subjects: [] });
  }, []);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.instructor?.name?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q)
      );
    }

    if (activeTab !== 'All') {
      if (activeTab === 'Paid') result = result.filter(c => c.price > 0);
      if (activeTab === 'Free') result = result.filter(c => c.price === 0);
      if (activeTab === 'Sale') result = result.filter(c => c.tags?.includes('Sale'));
      if (activeTab === 'Bundle') result = result.filter(c => c.isBundle);
    }

    // Filter by Grades
    if (filters.grades.length > 0) {
      result = result.filter(c => filters.grades.includes(c.grade));
    }

    // Filter by Boards
    if (filters.boards.length > 0) {
      result = result.filter(c => filters.boards.includes(c.board));
    }

    // Filter by Subjects
    if (filters.subjects.length > 0) {
      result = result.filter(c => filters.subjects.includes(c.subject));
    }

    // Sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Relevance - keep original order or refine
        break;
    }

    return result;
  }, [courses, searchQuery, activeTab, filters, sortOption]);

  return (
    <div className='h-[100dvh] flex flex-col overflow-hidden bg-gray-50 font-sans'>
      <Navbar />

      <div className="flex md:mt-5 flex-col flex-1 pt-[72px] w-full max-w-[1920px] mx-auto min-h-0">

        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 xl:px-12 pb-2 bg-gray-50 z-10">
          <div className="mb-2 sm:mb-6 mt-2">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-2">All Courses</h1>
            <p className="text-xs sm:text-base text-gray-500">Find the perfect study material for your Class, Board, and Subject.</p>
          </div>

          <FilterBar
            filters={filters}
            toggleFilter={toggleFilter}
            removeFilter={removeFilter}
            clearAllFilters={clearAllFilters}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            resultCount={filteredCourses.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
            availableClasses={availableClasses}
            availableBoards={availableBoards}
            availableSubjects={availableSubjects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 xl:px-12 pb-12 scroll-smooth">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, id) => (
                <CourseCard key={id} course={course} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mx-1">
              <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
              <p className="text-gray-500 mt-2 max-w-md text-center px-4">
                We couldn't find any courses matching your specific criteria.
              </p>
              <button
                onClick={() => {
                  clearAllFilters();
                  setSearchQuery('');
                  setActiveTab('All');
                }}
                className="mt-6 px-6 py-2 bg-blue-50 rounded-full text-blue-600 font-semibold hover:bg-blue-100 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}