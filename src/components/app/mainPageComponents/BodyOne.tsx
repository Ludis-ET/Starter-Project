import React from "react";
import StartApplication from "../buttonComponents/StartApplication";
import BodyTwo from "./BodyTwo";
import BodyThree from "./BodyThree";
import BodyFour from "./BodyFour";
import BodyFive from "./BodyFive";
import Landingfooter from "../Footer/Landingfooter";
// import bodyone from '../../app/auth/register'
import Link from "next/link";
import heroimage from "../../../../public/Images/image1.png";
import LandingHeader from "../Headers/Landingheader";

const BodyOne = () => {
  return (
    <>
      <div>
        <LandingHeader />
      </div>
      <div
        className="relative h-[70vh] flex items-center justify-center px-4 md:px-20 text-white"
        style={{
          backgroundImage: `url(${heroimage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Forge Your Future in Tech
          </h1>

          <p className="mt-6 text-lg sm:text-xl font-light">
            Join an elite community of Africa's brightest minds, and get
            fast-tracked to a software engineering career at the world's leading
            tech companies.
          </p>
          <div className="mt-8">
            {/* <Link href = '/adminFunctionality/createNewUser'><StartApplication/></Link> */}
            <Link href="/register">
              <StartApplication />
            </Link>
          </div>
        </div>
      </div>
      <div className="min-h-[10vh] sm:min-h-[12vh] md:min-h-[15vh] bg-gray-100 flex flex-col sm:flex-row sm:flex-wrap justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-8 lg:space-x-12 py-4 sm:py-6 md:py-8">
        {/* Google Logo */}
        <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
          <img
            src="http://purepng.com/public/uploads/large/purepng.com-google-logo-2015brandlogobrand-logoiconssymbolslogosgoogle-6815229372333mqrr.png"
            alt="Google Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Amazon Logo */}
        <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
          <img
            src="https://www.picng.com/upload/amazon/png_amazon_63353.png"
            alt="Amazon Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Databricks Logo */}
        <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/63/Databricks_Logo.png"
            alt="Databricks Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Goldman Sachs Logo — SVG */}
        <div className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[140px]">
          <img
            src="Images\image.png"
            alt="Goldman Sachs Logo"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <BodyTwo />
      <BodyThree />
      <BodyFour />
      <BodyFive />
      <Landingfooter />
    </>
  );
};

export default BodyOne;
