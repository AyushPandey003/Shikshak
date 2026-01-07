
'use client';

import React, { useState } from 'react';
import { FeatureCard } from './FeatureCard';
import { StudentFeature } from './StudentFeature';
import { InstitutionFeature } from './InstitutionFeature';
import { TeacherFeature } from './TeacherFeature';

const FEATURES = [
    {
        id: 'student',
        title: 'Student',
        Component: StudentFeature,
        className: 'bg-[#e3d5ca]',
        textColor: 'text-[#1A1A1A]',
    },
    {
        id: 'institution',
        title: 'Institution',
        Component: InstitutionFeature,
        className: 'bg-[#E89E25]',
    },
    {
        id: 'teacher',
        title: 'Teacher',
        Component: TeacherFeature,
        className: 'bg-[#4A6741]',
    }
];

export const FeaturesAccordion = () => {
  const [activeFeature, setActiveFeature] = useState<string>('institution');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-4 w-full h-[600px] md:h-[600px]">
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            index={index}
            title={feature.title}
            isActive={activeFeature === feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={feature.className}
            textColor={feature.textColor} // Optional prop
          >
            <feature.Component />
          </FeatureCard>
        ))}
      </div>
    </div>
  );
};
