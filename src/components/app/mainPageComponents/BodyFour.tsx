import React from "react";

const BodyFour = () => {
  return (
    <div id="testimonials" className="min-h-[60vh] bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-3xl md:text-4xl font-bold text-black text-center mb-4">
          Hear from Our Alumni
        </div>
        <div className="text-gray-600 text-center mb-12">
          Success stories from our graduates who landed their dream jobs
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="text-gray-600 text-sm leading-relaxed mb-6">
              "A2SV completely changed the trajectory of my career. The training is intense, but 
              the community and the opportunities are unparalleled. I'm now at my dream company, 
              and I owe it all to A2SV."
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                AT
              </div>
              <div>
                <div className="text-sm text-black font-semibold">
                  Abel Tadesse
                </div>
                <div className="text-gray-500 text-xs">
                  Software Engineer, Google
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="text-gray-600 text-sm leading-relaxed mb-6">
              "The problem-solving skills I learned at A2SV are invaluable. The mentors push you 
              to be your best, and you're surrounded by people who are just as passionate as you are."
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                BT
              </div>
              <div>
                <div className="text-sm text-black font-semibold">
                  Bethlem Tadesse
                </div>
                <div className="text-gray-500 text-xs">
                  Software Engineer, Amazon
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
            <div className="text-gray-600 text-sm leading-relaxed mb-6">
              "A2SV is more than a bootcamp. It's a family that supports you long after you've 
              graduated. The network you build here is for life."
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                CA
              </div>
              <div>
                <div className="text-sm text-black font-semibold">
                  Caleb Alemayehu
                </div>
                <div className="text-gray-500 text-xs">
                  Software Engineer, Palantir
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFour;
