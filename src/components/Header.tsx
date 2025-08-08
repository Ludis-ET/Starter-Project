"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const filteredLinks = allLinks.filter(
    (link) => !link.roles || link.roles.includes(userRole)
  );

  return (
    <header className="flex items-center justify-around px-6 py-3 bg-white dark:bg-gray-900 shadow-md">
      <Link href="/">
          <img src="/assets/Logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>
      {/* <Image src="/window.svg" alt="Logo" width={36} height={36} /> */}
      <nav className="flex space-x-8">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-xl font-medium transition-colors ${
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

      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
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
    </header>
  );
};