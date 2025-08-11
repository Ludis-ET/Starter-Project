import Image from "next/image";
import Link from "next/link";

const LandingHeader = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/Logo.png"
            alt="A2SV Logo"
            width={110}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#journey"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            The Journey
          </Link>
          <Link
            href="#about"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            About
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Testimonials
          </Link>
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Apply Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Link
            href="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Apply
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
