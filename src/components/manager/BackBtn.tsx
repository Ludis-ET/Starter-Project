"use client";

import React from "react";
import { useRouter } from "next/navigation";

const BackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="px-4 py-2 text-gray-500 rounded-2xl hover:bg-gray-100"
    >
      ← Back to Dashboard
    </button>
  );
};

export default BackBtn;
