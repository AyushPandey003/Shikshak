import React from 'react';
import { Test } from '@/types/test';
import { Play, CheckCircle2, Clock, Award, HelpCircle, AlertCircle, ArrowRight, FileText } from 'lucide-react';

interface TestViewProps {
    test: Test;
    onStartTest: () => void;
    onViewResult?: () => void;
}

const TestView: React.FC<TestViewProps> = ({ test, onStartTest, onViewResult }) => {
    const isSubmitted = test.status === 'completed' || test.status === 'attempted';
    const externalTestUrl = `https://example.com/tests/${test.id}/start`;

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Header Section */}
            <div className="px-8 py-10 bg-linear-to-br from-slate-50 to-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${isSubmitted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-indigo-100 text-indigo-700'
                            }`}>
                            {isSubmitted ? 'Completed' : 'Assessment'}
                        </span>
                        {test.status === 'attempted' && (
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-700">
                                In Progress
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        {test.title}
                    </h1>

                    <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                        Evaluates your understanding of the core concepts covered in this module.
                        Please review the instructions carefully before starting.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-8 py-12">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Duration</p>
                                <p className="text-xl font-bold text-gray-900">{test.duration}</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Questions</p>
                                <p className="text-xl font-bold text-gray-900">{test.questions}</p>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {test.obtainedMarks !== undefined ? "Your Score" : "Total Marks"}
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {test.obtainedMarks !== undefined ? `${test.obtainedMarks} / ${test.totalMarks}` : test.totalMarks}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        {isSubmitted ? (
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Assessment Completed</h3>
                                    <p className="text-gray-500">
                                        You have successfully submitted this test. You can review your detailed performance report in the dashboard.
                                    </p>
                                </div>
                                {test.obtainedMarks !== undefined && (
                                    <div className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col items-center shadow-sm shrink-0">
                                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Your Score</span>
                                        <span className="text-3xl font-black text-indigo-700 leading-none">
                                            {test.obtainedMarks}<span className="text-lg text-indigo-400 font-bold">/{test.totalMarks}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : test.status === 'expired' ? (
                            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <Clock className="w-8 h-8 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">Assessment Expired</h3>
                                    <p className="text-gray-500">
                                        The deadline for this assessment has passed. You can no longer attempt this test.
                                    </p>
                                </div>
                                <button disabled className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl opacity-75 cursor-not-allowed shadow-sm">
                                    Test Deadline Reached
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start gap-4 mb-8">
                                    <AlertCircle className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900">Important Instructions</h3>
                                        <ul className="space-y-3 text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                Ensure you have a stable internet connection.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                Once started, the timer cannot be paused.
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                Do not refresh the page during the assessment.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={onStartTest}
                                        className="flex-1 py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-lg shadow-[0_4px_14px_0_rgba(79,70,229,0.3)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:translate-y-0 flex items-center justify-center gap-2">
                                        Start Assessment
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <button className="px-8 py-4 bg-white border-2 border-transparent text-gray-500 font-semibold rounded-xl hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        Practice Mode
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestView;
