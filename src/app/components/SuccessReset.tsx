"use client";

import Image from 'next/image';
import Link from 'next/link';
import { CiCircleCheck } from 'react-icons/ci';

const SuccessReset = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Success Content */}
        <div className="text-center">
          <CiCircleCheck className="text-green-500 text-6xl mx-auto" />
          <h3 className="mt-4 text-3xl font-bold text-gray-900">Action Successful!</h3>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been reset. You can now log in with your new password.
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/signin"
            className="inline-block py-2 px-42 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessReset;