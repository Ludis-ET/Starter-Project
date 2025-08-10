import React from "react";
import Link from "next/link";

const BodyFive = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to change your life?
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
          The next application cycle is now open. Take the first step toward 
          <span className="font-semibold text-white"> your dream career</span>.
        </p>
        <Link 
          href="/auth/signup"
          className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default BodyFive;
