"use client";
import React from "react";

const BodyTwo = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center bg-white text-black px-4 md:px-0">
      <div className="pt-20 text-center">
        <div className="font-bold text-3xl">Your Journey to Silicon Valley</div>
        <div className="font-light text-[16px] pt-4 text-gray-500">
          A proven path from Learning to Leadership
        </div>
      </div>

      <div className="pt-14 flex flex-col md:flex-row md:space-x-5 space-y-8 md:space-y-0 items-center">
        <div className="flex flex-row space-x-4 max-w-[300px]">
          <img
            src="/Images/download.svg"
            alt="Phase 1 Icon"
            className="w-10 h-10"
          />
          <div>
            <div className="font-bold">Phase 1: Foundations</div>
            <div className="text-gray-500 pt-3 text-sm">
              Master data structures, algorithms and problem-solving techniques
              in an intensive 3-month bootcamp.
            </div>
          </div>
        </div>

        <div className="flex flex-row space-x-4 max-w-[300px]">
          <img
            src="/Images/download2.svg"
            alt="Phase 2 Icon"
            className="w-10 h-10"
          />
          <div>
            <div className="font-bold">Phase 2: Real-World Projects</div>
            <div className="text-gray-500 pt-3 text-sm">
              Apply your skills to build complex projects, collaborate in teams,
              and prepare for technical interviews.
            </div>
          </div>
        </div>

        <div className="flex flex-row space-x-4 max-w-[300px]">
          <img
            src="/Images/download3.svg"
            alt="Phase 3 Icon"
            className="w-10 h-10"
          />
          <div>
            <div className="font-bold">Phase 3: Internship Placement</div>
            <div className="text-gray-500 pt-3 text-sm">
              We help you secure internships at top global tech companies to
              gain invaluable experience.
            </div>
          </div>
        </div>

        <div className="flex flex-row space-x-4 max-w-[300px]">
          <img
            src="/Images/download5.svg"
            alt="Phase 4 Icon"
            className="w-10 h-10"
          />
          <div>
            <div className="font-bold">Phase 4: Full-time Conversion</div>
            <div className="text-gray-500 pt-3 text-sm">
              Excel in your internship and convert it into a full-time offer,
              launching your global career.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyTwo;
