import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Star, CheckCircle, History, ArrowLeft, Pencil } from 'lucide-react';
import { Review, MOCK_REVIEWS } from '@/types/review';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; description: string; isAnonymous: boolean }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // New State for History/Edit
  const [viewMode, setViewMode] = useState<'write' | 'history'>('write');
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setViewMode('write');
      setEditingReviewId(null);
      setRating(0);
      setDescription('');
      setIsAnonymous(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would be an API call
    if (editingReviewId) {
      // Update existing review
      setReviews(prev => prev.map(r =>
        r.id === editingReviewId
          ? { ...r, rating, description, isAnonymous, date: new Date().toISOString().split('T')[0] }
          : r
      ));
    } else {
      // Create new review
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        courseId: 'current_course', // identifying course isn't critical for this mock
        rating,
        description,
        isAnonymous,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews(prev => [newReview, ...prev]);
    }

    // Call parent submit handler (keeping original behavior mostly)
    onSubmit({ rating, description, isAnonymous });

    setIsSubmitted(true);
    // Reset form
    // setRating(0);
    // setDescription('');
    // setIsAnonymous(false);
    // setEditingReviewId(null);
  };

  const handleEdit = (review: Review) => {
    setRating(review.rating);
    setDescription(review.description);
    setIsAnonymous(!!review.isAnonymous);
    setEditingReviewId(review.id || null);
    setViewMode('write');
  };

  const handleBackToWrite = () => {
    setRating(0);
    setDescription('');
    setIsAnonymous(false);
    setEditingReviewId(null);
    setViewMode('write');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="relative w-full h-full overflow-hidden flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center relative z-10 h-full min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Thank You!</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-sm">
              {editingReviewId ? 'Your review has been updated successfully.' : 'Your feedback has been submitted successfully. We appreciate your input!'}
            </p>
            <div className="flex gap-3 w-full">
              {/* <button
                onClick={() => {
                  setIsSubmitted(false);
                  setViewMode('history');
                }}
                className="flex-1 py-3.5 px-6 text-lg font-bold text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 focus:outline-none transition-all"
              >
                View History
              </button> */}
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-6 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all shadow-lg shadow-green-100"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'write' ? (
              <form onSubmit={handleSubmit} className="p-6 pt-2 relative z-10 flex flex-col h-full">
                {/* Header with History Button */}
                {/* <div className="absolute top-4 right-4 z-20">
                  <button
                    type="button"
                    onClick={() => setViewMode('history')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white/80 hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                  >
                    <History size={16} />
                    History
                  </button>
                </div> */}

                <div className="text-center mb-6 mt-4">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    {editingReviewId ? 'Edit Review' : 'Course Review'}
                  </h2>
                  <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
                    {editingReviewId ? 'Update your experience with this course.' : 'We would love to hear your thoughts, suggestions, concerns or problems with anything so we can improve!'}
                  </p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${star <= (hoverRating || rating)
                        ? 'bg-orange-500 shadow-lg shadow-orange-100 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={24}
                        className={`${star <= (hoverRating || rating)
                          ? 'fill-white text-white'
                          : 'fill-gray-300 text-gray-300'
                          } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                <div className="mb-4 flex-grow">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                    Write Your Experience
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 transition-all resize-none font-medium text-base h-32"
                    placeholder="Tell us about your experience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-2 mb-6 pl-1">
                  {/* <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                  {/* <label htmlFor="anonymous" className="text-sm font-semibold text-gray-600 select-none cursor-pointer hover:text-gray-800 transition-colors">
                    Submit Anonymous Feedback
                  </label> */} 
                </div>

                <div className="flex gap-3">
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReviewId(null);
                        setViewMode('history');
                      }}
                      className="flex-1 py-4 px-4 text-lg font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={rating === 0 || !description.trim()}
                    className="flex-1 py-4 px-4 text-lg font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-orange-100 transform active:scale-[0.98]"
                  >
                    {editingReviewId ? 'Update Review' : 'Submit Now'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 relative z-10 flex flex-col h-full max-h-[600px]">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={handleBackToWrite}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 bg-white/80 hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                  >
                    <ArrowLeft size={16} />
                    Write Review
                  </button>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Your History</h2>
                  <div className="w-[84px]"></div> {/* Spacer for alignment */}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      No reviews found.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                className={`${star <= review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-gray-200 text-gray-200'
                                  }`}
                              />
                            ))}
                            <span className="text-xs text-gray-400 ml-2">{review.date}</span>
                          </div>

                          <button
                            onClick={() => handleEdit(review)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Review"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {review.description}
                        </p>

                        {review.isAnonymous && (
                          <div className="mt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                            Anonymous
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModal;
