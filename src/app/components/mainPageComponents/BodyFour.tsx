import React from "react";

const BodyFour = () => {
  return (
    <div className="min-h-[60vh] bg-gray-50 py-12 px-4">
      <div className="text-2xl md:text-3xl font-bold text-black text-center mb-10">
        Hear From Our Alumni
      </div>

      <div className="flex flex-col md:flex-row md:justify-center items-center md:space-x-6 space-y-6 md:space-y-0">
        <div className="w-full max-w-sm bg-white rounded-[7px] shadow-2xl shadow-gray-300 p-5">
          <div className="text-gray-500 text-sm font-light mb-6">
            "A2SV completely changed the trajectory of my career. The training
            is insane, but the community and the opportunities are unparalleled.
            I'm now at my dream company, and I owe it all to A2SV."
          </div>
          <div className="flex items-center space-x-3">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src="/Images/person1.jpeg"
              alt="Abel Tadesse"
            />
            <div>
              <div className="text-[14px] text-black font-medium">
                Abel Tadesse
              </div>
              <div className="text-gray-500 text-[13px]">
                Software Engineer, Google
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white rounded-[7px] shadow-2xl shadow-gray-300 p-5">
          <div className="text-gray-500 text-sm font-light mb-6">
            "The problem-solving skills I learned at A2SV are invaluable. The
            mentors push you to be your best, and you're surrounded by people
            who are just as passionate as you are."
          </div>
          <div className="flex items-center space-x-3">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src="/Images/person2.jpeg"
              alt="Bethlem Tadesse"
            />
            <div>
              <div className="text-[14px] text-black font-medium">
                Bethlem Tadesse
              </div>
              <div className="text-gray-500 text-[13px]">
                Software Engineer, Amazon
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm bg-white rounded-[7px] shadow-2xl shadow-gray-300 p-5">
          <div className="text-gray-500  text-sm font-light mb-6">
            "A2SV is more than a bootcamp. It's a family that supports you long
            after you've graduated. The network you build here is for life."
          </div>
          <div className="flex items-center space-x-3">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src="/Images/person3.jpg"
              alt="Caleb Alemayehu"
            />
            <div>
              <div className="text-[14px] text-black font-medium">
                Caleb Alemayehu
              </div>
              <div className="text-gray-500 text-[13px]">
                Software Engineer, Palantir
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyFour;
