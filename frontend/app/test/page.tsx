'use client';

import React from 'react';
import ProctoringComponent from '@/components/ProctoringComponent';

export default function TestPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Proctoring Component Test</h1>

            <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800">
                <p className="mb-4 text-gray-400">
                    The proctoring component should appear in the bottom right corner.
                    It will track your eye movements and alert if you close your eyes for more than 2 seconds.
                </p>

                <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center border border-gray-700">
                    <span className="text-gray-500">Exam Content Placeholder</span>
                </div>
            </div>

            <ProctoringComponent />
        </div>
    );
}
