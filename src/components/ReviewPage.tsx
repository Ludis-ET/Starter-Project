"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ReviewData } from "@/types";

const ReviewPage: React.FC<{ applicant: ReviewData }> = ({ applicant }) => {
  const [activityNotes, setActivityNotes] = useState("");
  const [resumeScore, setResumeScore] = useState("");
  const [essayScore, setEssayScore] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted Review for ${applicant.name}: Notes: ${activityNotes}, Resume Score: ${resumeScore}, Essay Score: ${essayScore}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      <Link href="/dashboard" className="text-blue-600 text-sm mb-4">&lt; Back to Dashboard</Link>
      <div className="w-full lg:w-1/2 text-black">
        <h1 className="text-2xl font-bold mb-4">Review: {applicant.name}</h1>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Applicant Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">School</p>
              <p className="font-medium">{applicant.school}</p>
            </div>
            <div>
              <p className="text-gray-600">Degree Program</p>
              <p className="font-medium">{applicant.degree}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Coding Profiles</p>
              <p className="text-blue-600 font-medium">{applicant.codingProfiles}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Essay 1: Tell us about your self?</p>
              <p className="font-medium">{applicant.essay1}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Essay 2: Why do you want to join us?</p>
              <p className="font-medium">{applicant.essay2}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Resume</p>
              <a href="#" className="text-blue-600 font-medium">{applicant.resume}</a>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-black">Evaluation Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600">Activity Check Notes</label>
              <textarea
                className="w-full p-2 border rounded-lg placeholder:text-gray-400"
                value={activityNotes}
                onChange={(e) => setActivityNotes(e.target.value)}
                placeholder="Enter notes"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Resume Score</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg placeholder:text-gray-400"
                  value={resumeScore}
                  onChange={(e) => setResumeScore(e.target.value)}
                  placeholder="Enter score"
                />
              </div>
              <div>
                <label className="block text-gray-600">Essay Score</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg placeholder:text-gray-400"
                  value={essayScore}
                  onChange={(e) => setEssayScore(e.target.value)}
                  placeholder="Enter score"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg mt-4"
            >
              Save & Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;