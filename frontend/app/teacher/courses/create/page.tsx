"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAppStore } from "@/store/useAppStore"





export default function CreateCoursePage() {
  const [course, setCourse] = useState({
    title: "",
    subject: "",
    description: "",
    board: "",
    price: "",
    duration: "",
    visibility: "public",
    thumbnail: null as File | null,
  });
  const [isLoading, SetIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const { profile } = useAppStore();

  // console.log(profile);



  const sendDetails = async () => {
    try {

      axios.post("http://localhost:4000/material/courses/create_course", {
        name: course.title,
        subject: course.subject,
        teacher_details: {
          id: profile?.id,
          name: profile?.name,
          qualification: profile?.teacherDetails?.qualifications.join(","),
          class: profile?.teacherDetails?.classes.join(","),
          experience: profile?.teacherDetails?.experiences,
        },
        description: course.description,
        price: course.price,
        duration: course.duration,
        visibility: course.visibility,
        thumbnail: thumbnailUrl,
        board: course.board,
        price_category: Number(course.price) > 0 ? 'paid' : 'free',

      }, { withCredentials: true })
      console.log("Course created successfully")
    }
    catch (error) {
      console.log("Invalid details")
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  }



  async function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.files)
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:4000/material/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      })
      console.log("Upload response:", res.data);

    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    SetIsLoading(true);
    e.preventDefault();
    // api call -- TODO
    console.log(course);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-semibold">{course.visibility == "public" ? "Publishing" : "Drafting"} course...</p>
      </div>
    );
  }

  return (

    <div className="p-5 md:p-5">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xl font-semibold">
            Fill in the details to publish your course
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Thumbnail
            </label>

            <div className="flex items-center gap-4 w-full">
              <label className="cursor-pointer w-full border border-dashed rounded-lg px-4 py-6 text-sm text-zinc-500 hover:border-black">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnail}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="relative w-32 h-20 rounded overflow-hidden border">
                  <Image
                    src={preview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name
            </label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              placeholder="e.g. Complete Web Development"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none border-zinc-200"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={course.subject}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            />
          </div>
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Board
            </label>
            <input
              type="text"
              name="board"
              value={course.board}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what students will learn..."
              className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={course.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={course.duration}
                onChange={handleChange}
                placeholder="In weeks"
                className="w-full border rounded-lg px-3 py-2 border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Visibility
            </label>
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
              type="button"
              className="px-4 py-2 border text-sm font-semibold"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold"
              onClick={sendDetails}
            >
              Publish Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
