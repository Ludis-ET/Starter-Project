"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // icon package

interface HeaderLink {
  name: string;
  href: string;
  roles?: string[];
}

const allLinks: HeaderLink[] = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/admin", roles: ["admin"] },
  { name: "Users", href: "/admin/users", roles: ["admin"] },
  { name: "Cycles", href: "/admin/cycles", roles: ["admin"] },
  { name: "Analytics", href: "/admin/analytics", roles: ["admin"] },
];

export const Header = ({ userRole }: { userRole: string }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredLinks = allLinks.filter(
    (link) => !link.roles || link.roles.includes(userRole)
  );

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/assets/Logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg font-medium transition-colors ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 underline underline-offset-4"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
          <Link
            href="/profile"
            className={`hover:text-blue-500 ${
              pathname === "/profile"
                ? "underline underline-offset-4 text-blue-600 dark:text-blue-400"
                : ""
            }`}
          >
            Your Profile
          </Link>
          <span className="font-medium">
            {userRole === "admin" ? "Admin" : "User"}
          </span>
          <button className="text-red-500 hover:underline">Logout</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 px-4 py-4 space-y-4">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block text-lg font-medium ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400 underline underline-offset-4"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="border-t dark:border-gray-700 pt-4 space-y-2">
            <Link
              href="/profile"
              className={`block hover:text-blue-500 ${
                pathname === "/profile"
                  ? "underline underline-offset-4 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Your Profile
            </Link>
            <span className="block font-medium text-gray-600 dark:text-gray-300">
              {userRole === "admin" ? "Admin" : "User"}
            </span>
            <button className="block text-red-500 hover:underline">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
