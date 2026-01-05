
import React, { useState } from 'react';
import { AssessmentConfig } from '../types/types';

interface AssessmentFormProps {
  onStart: (config: AssessmentConfig) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onStart }) => {
  const [title, setTitle] = useState('English Proficiency Assessment');
  const [validUntil, setValidUntil] = useState('');
  const [questionsInput, setQuestionsInput] = useState(
    'Introduce yourself and your background.\nWhat are your professional goals for the next five years?'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions = questionsInput
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (questions.length === 0) {
      alert('Please enter at least one question.');
      return;
    }

    if (!validUntil) {
      alert('Please select a valid until date.');
      return;
    }

    onStart({ title, questions, validUntil });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configure Oral Test</h1>
        <p className="text-gray-600">Enter the details and questions for the AI examiner to ask.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Test Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. Midterm Oral Exam"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
          <input
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Questions (One per line)</label>
          <textarea
            value={questionsInput}
            onChange={(e) => setQuestionsInput(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-sans"
            placeholder="Question 1&#10;Question 2..."
            required
          />
          <p className="mt-2 text-xs text-gray-400">The AI will ask these in the exact order provided.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          Setup Permissions
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AssessmentForm;
