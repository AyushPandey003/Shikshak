'use client';
import React, { useState, useEffect } from 'react';
import { AuthUser, UserRole, UserProfile } from '@/types/auth';
import { User, Briefcase, GraduationCap, Users, BookOpen, ChevronRight, Check } from 'lucide-react';

interface UserDetailsPageProps {
    authUser?: AuthUser;
    onSubmit?: (profile: UserProfile) => void;
}

export const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ authUser: initialAuthUser, onSubmit }) => {
    // Use mock data if authUser is not provided (standalone page access)
    const [authUser, setAuthUser] = useState<AuthUser | undefined>(initialAuthUser);

    useEffect(() => {
        // If no authUser provided, create a mock one from login
        if (!authUser) {
            const mockUser: AuthUser = {
                id: 'google-123456',
                email: 'student@shikshak.com',
                accessToken: 'mock-token',
                photoUrl: '',
            };
            setAuthUser(mockUser);
        }
    }, [authUser]);
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<UserRole | null>(null);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subjects, setSubjects] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [experiences, setExperiences] = useState('');
    const [teacherClasses, setTeacherClasses] = useState('');

    const [studentClass, setStudentClass] = useState('');
    const [courses, setCourses] = useState('');

    const [referId, setReferId] = useState('');

    const handleNext = () => {
        if (step === 1 && role) {
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) return;

        const baseProfile = {
            id: authUser?.id || '',
            name,
            phoneNumber,
            role
        };

        let finalProfile: UserProfile = { ...baseProfile };

        if (role === UserRole.TEACHER) {
            finalProfile.teacherDetails = {
                subjects: subjects.split(',').map(s => s.trim()),
                qualifications: qualifications.split(',').map(s => s.trim()),
                experiences,
                classes: teacherClasses.split(',').map(s => s.trim())
            };
        } else if (role === UserRole.STUDENT) {
            finalProfile.studentDetails = {
                classGrade: studentClass,
                coursesEnrolled: []
            };
        } else if (role === UserRole.PARENT) {
            finalProfile.parentDetails = {
                referId
            };
        }

        if (onSubmit) {
            onSubmit(finalProfile);
        } else {
            console.log("Profile submitted:", finalProfile);
        }
    };

    const RoleCard = ({ selected, value, icon: Icon, title, description }: any) => (
        <div
            onClick={() => setRole(value)}
            className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 flex flex-col items-center text-center gap-2 ${selected === value
                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                }`}
        >
            <div className={`p-2 rounded-full ${selected === value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className={`font-bold text-sm ${selected === value ? 'text-blue-900' : 'text-slate-700'}`}>{title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 leading-tight">{description}</p>
            </div>
            {selected === value && <div className="absolute top-2 right-2 text-blue-500"><Check size={16} /></div>}
        </div>
    );

    return (
        <div className="h-screen w-screen bg-slate-50 flex justify-center items-center p-4 overflow-hidden">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Compact Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white shrink-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Complete your Profile</h1>
                            <p className="text-blue-100 text-sm mt-1">
                                Just a few details to get started.
                            </p>
                        </div>
                        {/* Progress Indicators */}
                        <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white' : 'text-blue-300'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs ${step >= 1 ? 'border-white bg-white text-blue-700' : 'border-blue-400'}`}>1</div>
                                <span className="font-medium text-xs hidden sm:block">Role</span>
                            </div>
                            <div className="w-8 h-0.5 bg-blue-400"></div>
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white' : 'text-blue-300'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-xs ${step >= 2 ? 'border-white bg-white text-blue-700' : 'border-blue-400'}`}>2</div>
                                <span className="font-medium text-xs hidden sm:block">Details</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">

                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                        <div className="h-full flex flex-col justify-center">
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-800">Who are you joining as?</h2>
                                <p className="text-slate-500 text-xs">Select your role.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <RoleCard
                                    selected={role}
                                    value={UserRole.STUDENT}
                                    icon={GraduationCap}
                                    title="Student"
                                    description="I want to learn and enroll in courses."
                                />
                                <RoleCard
                                    selected={role}
                                    value={UserRole.TEACHER}
                                    icon={Briefcase}
                                    title="Teacher"
                                    description="I want to create courses and teach."
                                />
                                {/* <RoleCard
                                    selected={role}
                                    value={UserRole.PARENT}
                                    icon={Users}
                                    title="Parent"
                                    description="I want to track my child's progress."
                                /> */}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    disabled={!role}
                                    onClick={handleNext}
                                    className={`flex cursor-pointer items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-sm transition-all ${role
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Continue <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Specific Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">

                            {/* Compact Grid Layout for Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <h3 className="col-span-full font-semibold text-slate-700 flex items-center gap-2 text-sm border-b pb-2">
                                    <User size={16} className="text-blue-500" /> Basic Information
                                </h3>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={authUser?.email || ''}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Tanishk Kapoor"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>

                                <div className="col-span-full md:col-span-1">
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+91 9XXXX XXXXX"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Role Specific Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <h3 className="col-span-full font-semibold text-blue-700 flex items-center gap-2 text-sm border-b pb-2 border-blue-100">
                                    {role === UserRole.TEACHER && <Briefcase size={16} />}
                                    {role === UserRole.STUDENT && <GraduationCap size={16} />}
                                    {role === UserRole.PARENT && <Users size={16} />}
                                    {role === UserRole.TEACHER && "Professional Details"}
                                    {role === UserRole.STUDENT && "Academic Details"}
                                    {role === UserRole.PARENT && "Referral Details"}
                                </h3>

                                {/* TEACHER FORM */}
                                {role === UserRole.TEACHER && (
                                    <>
                                        <div className="col-span-full">
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Subjects</label>
                                            <input
                                                type="text"
                                                required
                                                value={subjects}
                                                onChange={(e) => setSubjects(e.target.value)}
                                                placeholder="Math, Physics"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Qualifications</label>
                                            <input
                                                type="text"
                                                required
                                                value={qualifications}
                                                onChange={(e) => setQualifications(e.target.value)}
                                                placeholder="B.Ed, M.Sc"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Experience</label>
                                            <input
                                                type="text"
                                                required
                                                value={experiences}
                                                onChange={(e) => setExperiences(e.target.value)}
                                                placeholder="5 Years"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Classes Taught</label>
                                            <input
                                                type="text"
                                                required
                                                value={teacherClasses}
                                                onChange={(e) => setTeacherClasses(e.target.value)}
                                                placeholder="9th, 10th"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* STUDENT FORM */}
                                {role === UserRole.STUDENT && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Current Class</label>
                                            <select
                                                required
                                                value={studentClass}
                                                onChange={(e) => setStudentClass(e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                                            >
                                                <option value="">Select</option>
                                                <option value="5">Class 5</option>
                                                <option value="6">Class 6</option>
                                                <option value="7">Class 7</option>
                                                <option value="8">Class 8</option>
                                                <option value="9">Class 9</option>
                                                <option value="10">Class 10</option>
                                                <option value="11">Class 11</option>
                                                <option value="12">Class 12</option>
                                            </select>
                                        </div>
                                        {/* <div className="col-span-full">
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Interests</label>
                                            <input
                                                type="text"
                                                value={courses}
                                                onChange={(e) => setCourses(e.target.value)}
                                                placeholder="English, Science, Math"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div> */}
                                    </>
                                )}

                                {/* PARENT FORM */}
                                {role === UserRole.PARENT && (
                                    <>
                                        <div className="col-span-full">
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Child's Student ID</label>
                                            <input
                                                type="text"
                                                required
                                                value={referId}
                                                onChange={(e) => setReferId(e.target.value)}
                                                placeholder="STU-123456"
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center pt-2 mt-auto">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="text-slate-500 cursor-pointer hover:text-slate-800 font-medium px-4 py-2 text-sm transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-sm"
                                >
                                    Complete Setup
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserDetailsPage;