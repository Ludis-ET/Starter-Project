"use client";

import React from "react";
import BackBtn from "./BackBtn";
import { Application } from "@/types";
import Link from "next/link";

interface prop {
  details : Application
  setIsReviewOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewAppClientSide = ({ details, setIsReviewOpen}:  prop) => {
  function handleClose() {
    setIsReviewOpen(false);
  }
  return (
    <div onClick={handleClose} className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm bg-black/50 ">
      <div className="bg-gray-100 rounded-4xl border border-gray-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-6 md:p-10">
          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-10">
            <div className="grid grid-cols-1">
              <div className="items-center gap-4 w-full md:w-full mx-auto mb-6 md:mb-10">
                <div className="flex justify-between">
                <BackBtn /> <button onClick={handleClose} className="text-lg font-bold">X</button>

                </div>
                <h1 className="pl-5 text-xl sm:text-2xl md:text-3xl font-extrabold">
                  Manage: {details.applicant_name}
                </h1>
              </div>

              {/* Applicant Profile */}
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-[900px]">
                <h2 className="text-xl font-semibold mb-4">
                  Applicant Profile
                </h2>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 lg:gap-100">
                    <div>
                      <div className="text-sm text-gray-500">School</div>
                      <p className="font-medium">{details.school}</p>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">
                        Degree Program
                      </div>
                      <p className="font-medium">{details.degree}</p>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Coding Profiles</div>
                    <div className="flex gap-3 font-medium text-indigo-600">
                      <Link href="">GitHub</Link>
                      <Link href={details.leetcode_handle}>LeetCode</Link>
                      <Link href={details.codeforces_handle}>Codeforces</Link>
                    </div>
                  </div>

                  <div className="break-words">
                    <div className="text-sm text-gray-500 mb-1">
                      Essay 1: Tell us about yourself
                    </div>
                    <p>{details.essay_about_you}</p>
                  </div>

                  <div className="break-words">
                    <div className="text-sm text-gray-500 mb-1">
                      Essay 2: Why do you want to join us?
                    </div>
                    <p>{details.essay_why_a2sv}</p>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Resume</div>
                    <Link
                      href={details.resume_url ? details.resume_url : ""}
                      className="text-violet-700 underline"
                    >
                      View Resume.pdf
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAppClientSide;
