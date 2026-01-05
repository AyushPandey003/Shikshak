'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AssessmentForm from '../../../components/AssessmentForm';
import { AssessmentConfig } from '../../../types/types';
import axios from 'axios';
import { useAppStore } from '@/store/useAppStore';

const CreateTestPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [course_id, setCourseId] = useState('');
    const [user_id, setUserId] = useState('');
    const { profile } = useAppStore();

    useEffect(() => {
        if (profile?.role !== 'teacher') {
            router.push('/');
        }
    }, [profile, router]);

    const data = searchParams.get('data');

    useEffect(() => {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setCourseId(parsedData.course_id);
                setUserId(parsedData.user_id);
            } catch (e) {
                console.error("Failed to parse data query param", e);
            }
        }
    }, [data]);


    const handleStartSetup = async (config: AssessmentConfig) => {
        // Save config to local storage to be accessed by the start page
        if (typeof window !== 'undefined') {
            localStorage.setItem('assessment_config', JSON.stringify(config));
        }
        console.log(config);
        // call api to create a test
        await axios.post('http://localhost:4000/material/test-create', {
            title: config.title,
            questions: config.questions,
            course_id: course_id,
            user_id: user_id,
            valid_until: config.validUntil,
        }, { withCredentials: true });
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
