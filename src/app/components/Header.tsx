import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link href="/">
          <img src="/assets/Logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex space-x-6">
        <Link
          href="/about"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          About
        </Link>
        <Link
          href="/services"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Services
        </Link>
        <Link
          href="/contact"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Contact
        </Link>
        <Link
          href="/signin"
          className="text-gray-600 hover:text-blue-600 transition-colors font-semibold"
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
};

export default Header;
