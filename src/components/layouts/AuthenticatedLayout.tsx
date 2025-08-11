"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, User, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import a2sv from "../../../public/Images/a2sv.svg";
import Image from "next/image";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavigationLinks = () => {
    const role = session?.user?.role || "";
    const baseLinks = [
      {
        name: "Profile",
        href: "/profile",
        roles: ["admin", "reviewer", "applicant"],
      },
    ];

    const roleSpecificLinks = {
      admin: [
        { name: "Users", href: "/admin/users" },
        { name: "Cycles", href: "/admin/cycles" },
        { name: "Analytics", href: "/admin/analytics" },
      ],
      reviewer: [{ name: "Assigned Reviews", href: "/reviewer/dashboard" }],
      applicant: [
        { name: "My Application", href: "/applicant/dashboard" },
        { name: "Apply", href: "/applicant/apply" },
      ],
    };

    const links = [...baseLinks];
    if (role in roleSpecificLinks) {
      links.push(...(roleSpecificLinks as any)[role]);
    }

    return links.filter((link) => !link.roles || link.roles.includes(role));
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* <Link href="/" className="flex items-center space-x-2"> */}
              {/* <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"> */}
              {/* <span className="text-white font-bold text-lg">A2SV</span> */}
              <Image src={a2sv} alt="logo" />

              {/* </div> */}
              {/* <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                  Application Platform
                </span> */}
              {/* </Link> */}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 md:flex space-x-8">
              {navigationLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-gray-500 capitalize">
                    {session?.user?.role || "User"}
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigationLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-gray-500 capitalize">
                      {session?.user?.role || "User"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-400">
            © 2024 A2SV Application Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;
