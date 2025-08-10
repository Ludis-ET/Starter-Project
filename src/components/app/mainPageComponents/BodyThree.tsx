import React from "react";

const BodyThree = () => {
  return (
    <div id="about" className="min-h-[60vh] flex flex-col md:flex-row items-center text-black bg-gray-100 px-6 md:px-20 py-10">
      <div className="flex flex-col w-full md:w-1/2 mb-8 md:mb-0">
        <div className="text-3xl md:text-4xl font-bold text-center md:text-left">
          Built by Engineers, for Engineers
        </div>
        <div className="pt-4 text-gray-500 text-center md:text-left text-base">
          A2SV is not just a program; it's a community. We're on a mission to
          identify Africa's most brilliant minds and provide them with the
          resources, mentorship, and opportunities to solve humanity's greatest
          challenges.
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="/Images/image-43.webp"
          alt="Engineers working"
          className="rounded-2xl w-full max-w-[450px] h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default BodyThree;
