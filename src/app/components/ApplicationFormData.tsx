"use client";

import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ApplicationFormData {
  id: string;
  school: string;
  degree: string;
  codeforces: string;
  leetcode: string;
  github: string;
  aboutYourself: string;
  whyJoinUs: string;
  resume: FileList;
}

const ApplicationForm = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    mode: 'onBlur',
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const onSubmit = (data: ApplicationFormData) => {
    console.log('Application submitted:', data);
    // Replace with your API call to submit the form
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-baseline justify-center bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Form Title */}
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Application Form</h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-sm font-medium text-gray-700">
          <span className={step === 1 ? 'text-blue-600' : ''}>1. Personal Info</span>
          <span className={step === 2 ? 'text-blue-600' : ''}>2. Coding Profiles</span>
          <span className={step === 3 ? 'text-blue-600' : ''}>3. Essays & Resume</span>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <input
                  id="id"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Student ID or Application ID"
                  {...register('id', {
                    required: 'ID is required',
                  })}
                />
                {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>}
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                  School
                </label>
                <input
                  id="school"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.school ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your School"
                  {...register('school', {
                    required: 'School is required',
                  })}
                />
                {errors.school && <p className="mt-1 text-sm text-red-600">{errors.school.message}</p>}
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                  Degree
                </label>
                <input
                  id="degree"
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.degree ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., B.S. Computer Science"
                  {...register('degree', {
                    required: 'Degree is required',
                  })}
                />
                {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Coding Profiles */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="codeforces" className="block text-sm font-medium text-gray-700">
                  Codeforces Profile (Optional)
                </label>
                <input
                  id="codeforces"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.codeforces ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://codeforces.com/profile/username"
                  {...register('codeforces', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?codeforces\.com\/profile\/.+$/,
                      message: 'Invalid Codeforces URL',
                    },
                  })}
                />
                {errors.codeforces && <p className="mt-1 text-sm text-red-600">{errors.codeforces.message}</p>}
              </div>

              <div>
                <label htmlFor="leetcode" className="block text-sm font-medium text-gray-700">
                  LeetCode Profile (Optional)
                </label>
                <input
                  id="leetcode"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.leetcode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://leetcode.com/username"
                  {...register('leetcode', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?leetcode\.com\/.+$/,
                      message: 'Invalid LeetCode URL',
                    },
                  })}
                />
                {errors.leetcode && <p className="mt-1 text-sm text-red-600">{errors.leetcode.message}</p>}
              </div>

              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub Profile (Optional)
                </label>
                <input
                  id="github"
                  type="url"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.github ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://github.com/username"
                  {...register('github', {
                    pattern: {
                      value: /^https?:\/\/(www\.)?github\.com\/.+$/,
                      message: 'Invalid GitHub URL',
                    },
                  })}
                />
                {errors.github && <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Essays & Resume */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="aboutYourself" className="block text-sm font-medium text-gray-700">
                  Tell About Yourself
                </label>
                <textarea
                  id="aboutYourself"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.aboutYourself ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe yourself, your interests, and background"
                  rows={4}
                  {...register('aboutYourself', {
                    required: 'This field is required',
                    minLength: { value: 50, message: 'Must be at least 50 characters' },
                  })}
                />
                {errors.aboutYourself && (
                  <p className="mt-1 text-sm text-red-600">{errors.aboutYourself.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="whyJoinUs" className="block text-sm font-medium text-gray-700">
                  Why Do You Want to Join Us?
                </label>
                <textarea
                  id="whyJoinUs"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.whyJoinUs ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Explain your motivation for joining us"
                  rows={4}
                  {...register('whyJoinUs', {
                    required: 'This field is required',
                    minLength: { value: 50, message: 'Must be at least 50 characters' },
                  })}
                />
                {errors.whyJoinUs && <p className="mt-1 text-sm text-red-600">{errors.whyJoinUs.message}</p>}
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                  Upload Resume (PDF)
                </label>
                <input
                  id="resume"
                  type="file"
                  accept="application/pdf"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.resume ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('resume', {
                    required: 'Resume is required',
                    validate: {
                      isPDF: (files) =>
                        files[0]?.type === 'application/pdf' || 'Only PDF files are allowed',
                    },
                  })}
                />
                {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-700 ${
                step === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              Back
            </button>
            {step < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;