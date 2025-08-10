"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

interface ManagerHeaderProps {
  userRole?: string;
  userName?: string;
}

export default function ManagerHeaderForDetails({ userRole = 'manager', userName }: ManagerHeaderProps) {
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
        <div className="flex items-center justify-end lg:h-16 px-6">
            {/* Logo */}
          <div className="mr-10 flex-shrink-0 lg:mr-250">
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
          {/* User Info and Actions */}
          <div className="flex items-end space-x-6 pl-1">
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
