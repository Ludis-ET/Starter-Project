"use client";

import Image from 'next/image';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 ">
        {/* 404 and Message */}
        <div className="text-center">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">Sorry, we can’t find that page</h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center text-sm">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;