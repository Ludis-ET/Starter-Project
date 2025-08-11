"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// --- SVG Icon Components for clarity ---
const MenuIcon = () => (
  <svg
    className="h-6 w-6"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="h-6 w-6"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface AdminHeaderProps {
  userRole?: string;
  userName?: string;
}

export default function AdminHeader({
  userRole = "Admin User",
  userName,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Cycles", href: "/admin/cycles" },
    { name: "Analytics", href: "/admin/analytics" },
  ];

  // Dynamically determine active state
  const isActive = (href: string) => {
    return href === "/admin" ? pathname === href : pathname.startsWith(href);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const userInitial =
    userName?.charAt(0)?.toUpperCase() ||
    session?.user?.email?.charAt(0)?.toUpperCase() ||
    "A";
  const userDisplayName = userName || session?.user?.email;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* --- Left Section: Logo --- */}
          <div className="flex-shrink-0">
            <Link href="/admin" className="flex items-center">
              <Image
                src="/assets/Logo.png"
                alt="A2SV Logo"
                width={110}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </div>

          {/* --- Center Section: Desktop Navigation --- */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-10">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-2 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* --- Right Section: Desktop User Info & Actions --- */}
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/profile" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-all">
                <span className="text-sm font-bold text-blue-600">
                  {userInitial}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium text-gray-800 leading-tight">
                  {userDisplayName}
                </span>
                <span className="text-xs text-gray-500 leading-tight">
                  {userRole}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 text-gray-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

          {/* --- Mobile: Hamburger Menu Button --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Menu Panel --- */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-200"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-base font-bold text-blue-600">
                    {userInitial}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {userDisplayName}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {userRole}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Your Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-red-50 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
