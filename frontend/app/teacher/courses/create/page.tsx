"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Info, LayoutGrid, Image as ImageIcon, Plus, Type, X, FileText, DollarSign, Timer } from "lucide-react";

export default function CreateCoursePage() {
  const router = useRouter();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    thumbnail: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  }

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCourse((prev) => ({ ...prev, thumbnail: file }));
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        // Redirect to module creation
        // Using mock ID '1' for now as per flow
        router.push('/teacher/courses/1/modules');
    }, 1000);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      
      {/* Main Content Form */}
      <div className="flex-1 px-6 py-6 md:px-12 md:py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Course information</h1>
            <p className="text-gray-500 mb-8 text-sm">
                Provide basic information about the course to make it attractive to potential students.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Course Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course name</label>
                    <input 
                        type="text"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        placeholder="Enter course name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe what students will learn in this course..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-y"
                    />
                </div>

                {/* Category & Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <div className="flex gap-2">
                            <select
                                name="category"
                                value={course.category}
                                onChange={handleChange}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                            >
                                <option value="">Select category</option>
                                <option value="cs">Computer Science</option>
                                <option value="business">Business</option>
                                <option value="design">Design</option>
                            </select>
                            <button type="button" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                        <select
                            name="level"
                            value={course.level}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                            <option value="">Select level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={course.price}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            value={course.duration}
                            onChange={handleChange}
                            placeholder="In weeks or hours"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-all text-center group cursor-pointer relative">
                         <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnail}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {preview ? (
                             <div className="relative w-full h-48 rounded-lg overflow-hidden mx-auto">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                             </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ImageIcon size={32} />
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    Drag image here or click to upload
                                </p>
                                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm group-hover:shadow-md transition-shadow">
                                    Upload Image
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-8">
                     <button 
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                     >
                        {isLoading ? 'Creating...' : 'Create & Continue'}
                     </button>
                </div>

            </form>
        </div>
      </div>

      {/* Quick Tips Sidebar */}
      <div className="w-full md:w-[480px] bg-white border-l border-gray-100 p-8 hidden md:block flex-shrink-0">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-gray-900">Quick tips</h2>
              <button className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
              </button>
          </div>

          <div className="space-y-8">
              
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Type size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Course Title</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Craft a catchy title and capture your students imagination. Make it short, precise, memorable and SEO friendly.
                      </p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Description</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Write a compelling description that highlights the key benefits and learning outcomes of your course.
                      </p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <LayoutGrid size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Category</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Choose the right category to help students find your course easily among thousands of others.
                      </p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <DollarSign size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Price</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Set a competitive price. Consider the value you're providing and what similar courses charge.
                      </p>
                  </div>
              </div>

              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Timer size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Duration</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Provide an accurate estimate of the time required to complete the course, including assignments.
                      </p>
                  </div>
              </div>

               <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={20} />
                  </div>
                  <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Course Thumbnail</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                          Go for something original and high quality. You need something memorable that resonates with your audience.
                      </p>
                  </div>
              </div>

          </div>
      </div>

    </div>
  );
}
