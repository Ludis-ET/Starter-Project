"use client";

import React from "react";
import Link from "next/link";
import { AppData } from "@/types";

const AppCard: React.FC<{ app: AppData }> = ({ app }) => {
  const { name, submitted, status, id } = app;
  const CategoryStyles: Record<string, { bg: string; text: string }> = {
    "Under Review": { bg: "bg-[#FEF9C3]", text: "text-[#854D0E]" },
    "Review Complete": { bg: "bg-[#DBEAFE]", text: "text-[#166534]" },
    New: { bg: "bg-[#DBEAFE]", text: "text-[#166534]" },
  };
  const style = CategoryStyles[status] || CategoryStyles["New"];

  const buttonText =
    status === "Under Review" ? "Continue Review" : "Start Review";
  const isReviewed = status === "Review Complete";

  return (
    <div className="flex flex-col gap-3 w-[384px] h-[201px] border rounded-xl">
      <div className="flex flex-col gap-2 pt-[30px] pl-[24px]">
        <div className="flex gap-3">
          <div>
            <img src="/favicon.ico" alt="" width={48} />{" "}
            {/* Updated path for Next.js public folder */}
          </div>
          <div className="flex flex-col">
            <h3 className="text-black font-bold">{name}</h3>
            <p className="text-gray-500">Submitted: {submitted}</p>
          </div>
        </div>
        <div className={`${style.bg} w-fit px-2 py-1 rounded-3xl`}>
          <p className={`${style.text} font-bold text-sm`}>{status}</p>
        </div>
      </div>
      <div className="bg-[#F9FAFB] flex justify-center pt-[17px] pr-[24px] pb-[16px] pl-[24px] border-t border-t-[#E5E7EB]">
        {isReviewed ? (
          <Link
            href={`/review/${id}`}
            className="bg-[#4F46E5] text-white flex justify-center w-full px-[9px] py-[17px] border rounded-lg"
          >
            <p>{buttonText}</p>
          </Link>
        ) : (
          <Link
            href={`/job-details/${id}`}
            className="bg-[#4F46E5] text-white flex justify-center w-full px-[9px] py-[17px] border rounded-lg"
          >
            <p>{buttonText}</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppCard;
