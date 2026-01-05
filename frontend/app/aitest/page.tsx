'use client';

import React from 'react';
import Link from 'next/link';

export default function AITestLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Examiner</h1>
        <p className="text-gray-600">
          Select an option to proceed.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/aitest/create" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-center">
            Create Test
          </Link>
          <Link href="/aitest/start" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-all border border-gray-200 text-center">
            Start Test
          </Link>
        </div>
      </div>
    </div>
  );
}
