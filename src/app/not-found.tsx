"use client";

import Link from 'next/link';
import LandingFooter from "../components/app/Footer/Landingfooter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            {/* A2SV Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="/A2SV.png" 
                alt="A2SV Logo" 
                className="h-16 w-auto"
              />
            </div>
            
            {/* 404 Error */}
            <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
          
          {/* Action Button */}
          <Link 
            href="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
      
    </div>
  );
}
