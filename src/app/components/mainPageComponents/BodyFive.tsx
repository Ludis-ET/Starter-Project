import React from "react";
import ApplyNow from "../buttonComponents/ApplyNow";

const BodyFive = () => {
  return (
    <div
      className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 py-10"
      style={{ background: "rgb(67, 56, 202)" }}
    >
      <div className="w-full max-w-xl">
        <div className="font-extrabold text-2xl sm:text-3xl text-white">
          Ready to change your life?
        </div>
        <div className="font-extralight text-sm sm:text-base pt-5 text-indigo-200">
          The next application cycle is now open. Take the first step toward{" "}
          <span className="font-medium">your dream career</span>.
        </div>
        <div className="pt-7">
          <ApplyNow />
        </div>
      </div>
    </div>
  );
};

export default BodyFive;
