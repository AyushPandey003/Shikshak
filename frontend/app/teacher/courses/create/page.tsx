"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { API_CONFIG } from '@/lib/api-config';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user, profile } = useAppStore();

  const [course, setCourse] = useState({
    title: "",
    subject: "",
    description: "",
    board: "",
    grade: "",
    price: "",
    duration: "",
    visibility: "public",
    language: "English",
    course_outcomes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  }

  async function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const headers: Record<string, string> = {};
      if (user?.accessToken) {
        headers["Authorization"] = `Bearer ${user.accessToken}`;
      }

      const res = await axios.post(API_CONFIG.material.upload, formData, {
        headers,
        withCredentials: true
      });
      console.log("Upload response:", res.data);
      if (res.data && res.data.blobName) {
        setThumbnailUrl(res.data.blobName);
      }
    } catch (error: any) {
      console.error("Error uploading thumbnail:", error);
      alert(`Failed to upload thumbnail: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (!user || !profile) {
      alert("User profile not loaded. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: course.title,
        subject: course.subject,
        teacher_details: {
          id: user.id || "unknown", // Use Auth ID as fallback
          name: profile?.name || user.email?.split('@')[0] || "Instructor",
          qualification: profile?.teacherDetails?.qualifications?.join(",") || "N/A",
          class: profile?.teacherDetails?.classes?.join(",") || "N/A",
          experience: profile?.teacherDetails?.experiences || "N/A",
        },
        description: course.description,
        price: Number(course.price) || 0,
        duration: course.duration,
        visibility: course.visibility,
        thumbnail: thumbnailUrl,
        board: course.board,
        grade: course.grade,
        pricing_category: Number(course.price) > 0 ? 'paid' : 'free',
        language: course.language,
        course_outcomes: course.course_outcomes.split('\n').filter(line => line.trim() !== "")
      };

      console.log("Sending payload:", payload);

      const headers: Record<string, string> = {};
      if (user?.accessToken) {
        headers["Authorization"] = `Bearer ${user.accessToken}`;
      }

      await axios.post(API_CONFIG.material.courses.createCourse, payload, {
        headers,
        withCredentials: true
      });

      alert("Course created successfully!");
      router.push("/teacher/courses");

    } catch (error: any) {
      console.error("Error creating course:", error);
      alert(`Failed to create course: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-semibold">Publishing course...</p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-5">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <p className="text-xl font-semibold">
            Fill in the details to publish your course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 w-full">
              <label className="cursor-pointer w-full border border-dashed rounded-lg px-4 py-6 text-sm text-zinc-500 hover:border-black">
                Upload Image
                <input type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
              </label>
              {preview && (
                <div className="relative w-32 h-20 rounded overflow-hidden border">
                  <Image src={preview} alt="Thumbnail preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={course.title}
                onChange={handleChange}
                required
                placeholder="e.g. Complete Web Development"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="subject"
                value={course.subject}
                onChange={handleChange}
                required
                placeholder="e.g. Computer Science"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Board <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="board"
                value={course.board}
                onChange={handleChange}
                required
                placeholder="e.g. CBSE, ICSE"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Grade <span className="text-red-500">*</span></label>
              <select
                name="grade"
                value={course.grade}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              >
                <option value="" disabled>Select Grade</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Language <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="language"
                value={course.language}
                onChange={handleChange}
                required
                placeholder="e.g. English"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Describe what students will learn..."
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            />
          </div>

          {/* Course Outcomes */}
          <div>
            <label className="block text-sm font-medium mb-1">Course Outcomes (Per line) <span className="text-red-500">*</span></label>
            <textarea
              name="course_outcomes"
              value={course.course_outcomes}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Students will learn A...&#10;Students will learn B..."
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="duration"
                value={course.duration}
                onChange={handleChange}
                required
                placeholder="e.g. 10 weeks"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <select
              name="visibility"
              value={course.visibility}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private (Draft)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 w-full md:w-auto"
            >
              Publish Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}