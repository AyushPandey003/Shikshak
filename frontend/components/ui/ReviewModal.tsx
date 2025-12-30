import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Star, CheckCircle } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, description, isAnonymous });
    setIsSubmitted(true);
    // Reset form
    setRating(0);
    setDescription('');
    setIsAnonymous(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="relative w-full h-full overflow-hidden">
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
               Your feedback has been submitted successfully. We appreciate your input!
             </p>
             <button
               onClick={onClose}
               className="w-full py-3.5 px-6 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all shadow-lg shadow-green-100"
             >
               Close
             </button>
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-2 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Course Review</h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
              We would love to hear your thoughts, suggestions, concerns or problems with anything so we can improve!
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  star <= (hoverRating || rating)
                    ? 'bg-orange-500 shadow-lg shadow-orange-100 scale-110'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-white text-white'
                      : 'fill-gray-300 text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Write Your Experience
            </label>
            <textarea
              id="description"
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 transition-all resize-none font-medium text-base"
              placeholder="Tell us about your experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 mb-8 pl-1">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="anonymous" className="text-sm font-semibold text-gray-600 select-none cursor-pointer hover:text-gray-800 transition-colors">
                Submit Anonymous Feedback
              </label>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !description.trim()}
            className="w-full py-4 px-4 text-lg font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-orange-100 transform active:scale-[0.98]"
          >
            Submit Now
          </button>
        </form>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModal;
