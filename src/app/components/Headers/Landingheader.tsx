import Link from "next/link";

const LandingHeader = () => {
  return (
    <>
      <header
        className="flex justify-evenly p-3 flex-wrap"
        style={{ background: "#d7d7d7" }}
      >
        <img src="/A2SV.png" className="w-23 h-auto" alt="" />
        <div className="flex flex-wrap gap-8">
          <Link href="#" style={{ color: "#374151" }} className="text-sm">
            The Journey
          </Link>
          <Link href="#" style={{ color: "#374151" }} className="text-sm">
            About
          </Link>
          <Link href="#" style={{ color: "#374151" }} className="text-sm">
            Testimonials
          </Link>
          <Link
            href="/auth/signup"
            className="text-white font-semibold p-1 text-sm px-2   rounded-md"
            style={{ background: "#4f46e5" }}
          >
            Apply Now
          </Link>
        </div>
      </header>
    </>
  );
};

export default LandingHeader;
