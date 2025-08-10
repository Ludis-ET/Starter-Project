"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  Home, 
  FileText, 
  LogOut,
  Settings,
  Bell
} from "lucide-react";

export default function ApplicantNav() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/applicant/dashboard', icon: Home },
    { name: 'Application', href: '/applicant/Apply', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/applicant/dashboard" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-indigo-600">A2SV</div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                      ${isActive(item.href)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Info */}
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-xs text-gray-500">Applicant</p>
                </div>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Sign Out */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                    ${isActive(item.href)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile User Section */}
          <div className="border-t border-gray-200 px-2 pt-4 pb-3">
            {session?.user && (
              <div className="flex items-center px-3 py-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-900">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-sm text-gray-500">Applicant</p>
                </div>
              </div>
            )}
            
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="w-full justify-start text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
