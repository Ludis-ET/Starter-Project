"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoMenuSharp } from "react-icons/io5";
import { signOut } from "next-auth/react";

const ApplicantNav = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-gray-900 font-medium border-b-2 border-[#6366F1]"
      : "text-gray-500 hover:text-gray-700";

  // New class function for mobile links to add an underline
  const mobileLinkClass = (path: string) => {
    const baseStyle = "text-xl transition-colors";
    if (pathname === path) {
      // Style for the active mobile link
      return `${baseStyle} text-gray-900 font-semibold underline decoration-2 underline-offset-4 decoration-[#6366F1]`;
    }
    // Style for inactive mobile links
    return `${baseStyle} text-gray-500 hover:text-gray-900`;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6">
        <div className="relative hidden  md:flex items-center h-16">
          {/* Left - Logo */}
          <div className="absolute left-6 flex items-center ">
            <Link href="/">
              <Image
                src="/assets/Logo.png"
                alt="Logo"
                width={129}
                height={32}
                priority
              />
            </Link>
          </div>

          {/* Center - Dashboard */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/applicant/dashboard"
              className={linkClass("/applicant/dashboard")}
            >
              Dashboard
            </Link>
          </div>

          {/* Right - Profile Links */}
          <div className="absolute right-6 flex items-center space-x-6 text-sm">
            <Link
              href="/profile"
              className={linkClass("/profile")}
            >
              Your Profile
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
      {/* Right - Mobile Menu Icon */}
      <div className="md:hidden flex justify-between px-6">
        <Link href="/applicant/dashboard" className="cursor-pointer">
          <Image
            src="/assets/Logo.png"
            alt="Logo"
            width={129}
            height={32}
            priority
          />
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 text-2xl cursor-pointer"
        >
          <IoMenuSharp />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8">
          {/* Logo in top-left */}
          <Link
            href="/"
            className="absolute top-6 left-6"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/assets/Logo.png"
              alt="Logo"
              width={129}
              height={32}
              priority
            />
          </Link>
          {/* Close button in top-right */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-3xl text-gray-700"
            aria-label="Close menu"
          >
            &times;
          </button>
          {/* Menu items */}
          <Link
            href="/applicant/dashboard"
            className={mobileLinkClass("/applicant/dashboard")}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className={mobileLinkClass("/profile")}
            onClick={() => setMenuOpen(false)}
          >
            Your Profile
          </Link>

          <Link
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 transition-colors text-xl"
          >
            Logout
          </Link>
        </div>
      )}
    </header>
  );
};

export default ApplicantNav;
