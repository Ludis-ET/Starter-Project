import React from "react";

const LandingFooter = () => {
  return (
    <footer
      className="text-white py-10 text-sm"
      style={{ background: "rgb(31, 41, 55)" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center space-x-2 mb-2">
              <img
                src="/Images/a2sv_logo_transparent.png"
                alt="A2SV Logo"
                className="h-6"
              />
            </div>
            <p className="text-gray-400">
              Preparing Africa's top tech talent for global opportunities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-2 text-white text-xs">
                SOLUTIONS
              </h5>
              <ul className="space-y-2 text-gray-400">
                <li>Student Training</li>
                <li>Corporate Partnership</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2 text-white text-xs">SUPPORT</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2 text-white text-xs">COMPANY</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2 text-white text-xs">LEGAL</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />
        <div className="text-center text-gray-400 text-xs">
          &copy; 2023 A2SV. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
