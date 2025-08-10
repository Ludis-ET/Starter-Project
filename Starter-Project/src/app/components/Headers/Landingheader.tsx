import Link from "next/link";

const LandingHeader = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">A2SV</span>
            </div>
          </Link>
        </div>

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
            href="/auth/signup"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Apply Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Link
            href="/auth/signup"
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
