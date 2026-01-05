'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AssessmentForm from '../../../components/AssessmentForm';
import { AssessmentConfig } from '../../../types/types';

const CreateTestPage: React.FC = () => {
    const router = useRouter();

    const handleStartSetup = (config: AssessmentConfig) => {
        // Save config to local storage to be accessed by the start page
        if (typeof window !== 'undefined') {
            localStorage.setItem('assessment_config', JSON.stringify(config));
        }
        console.log(config);
        // call api to create a test
        alert('Test created successfully.');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-4xl">
                <AssessmentForm onStart={handleStartSetup} />
            </div>
        </div>
    );
};

export default CreateTestPage;
