import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";

const NAV_LINKS = ["Home", "About", "Services", "Doctors", "Contact"];

const SharedNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-xl shadow-sm border-b border-slate-200 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="px-6 md:px-20 flex justify-between items-center">

        <Link to="/" className="text-2xl font-black tracking-tight">
          <span className="text-cyan-500">Med</span>
          <span className={scrolled ? "text-slate-900" : "text-white"}>Tour</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((item) => {
            const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const active = pathname === to;
            return (
              <Link
                key={item}
                to={to}
                className={`relative text-[15px] font-medium transition-colors duration-200 group ${
                  active
                    ? "text-cyan-500"
                    : scrolled
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {item}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-500 rounded-full transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/30"
          >
            Book Consultation <FaArrowRight className="text-xs" />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 transition ${
              scrolled ? "text-slate-700 hover:text-cyan-500" : "text-white hover:text-cyan-300"
            }`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 shadow-lg">
          {NAV_LINKS.map((item) => {
            const to = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={item}
                to={to}
                className={`block text-base py-1 transition font-medium ${
                  pathname === to ? "text-cyan-500" : "text-slate-700 hover:text-cyan-500"
                }`}
              >
                {item}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-cyan-500 text-white px-6 py-3 rounded-full font-bold text-sm mt-2"
          >
            Book Free Consultation <FaArrowRight />
          </Link>
        </div>
      )}
    </nav>
  );
};

export default SharedNavbar;
