"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface ManagerHeaderProps {
  userRole?: string;
  userName?: string;
}

export default function ManagerHeader({ userRole = 'manager', userName }: ManagerHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigationItems = [
    { name: 'Dashboard', href: '/manager', active: pathname === '/manager' },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between lg:h-16 px-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/manager" className="flex items-center">
              <Image
                src="/assets/Logo.png"
                alt="A2SV Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden sm:flex flex-1 justify-center">
            <div className="flex lg:space-x-12">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                  {item.active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-6 pl-1">
            <Link
              href="/profile"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Your Profile
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {userName?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {userRole}
                </span>
                <span className="text-xs text-gray-500">
                  {userName || session?.user?.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
