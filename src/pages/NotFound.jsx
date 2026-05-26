import { Link } from "react-router-dom";
import { FaArrowRight, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-200 opacity-20 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg">
        <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-6">
          Error 404
        </p>

        <h1 className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-100 select-none">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4 text-slate-900">Page Not Found</h2>

        <p className="text-slate-500 leading-relaxed mb-10 text-base">
          The page you're looking for doesn't exist or has been moved. Let's get you back
          on track.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <FaHome className="text-sm" /> Back to Home
          </Link>
          <Link
            to="/contact"
            className="border border-slate-300 px-8 py-4 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition inline-flex items-center gap-2"
          >
            Contact Support <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          {[
            { label: "Services", to: "/services" },
            { label: "Doctors", to: "/doctors" },
            { label: "About", to: "/about" },
          ].map((link) => (
            <Link key={link.label} to={link.to} className="hover:text-cyan-600 transition">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
