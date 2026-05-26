import { useState, useEffect } from "react";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 450);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-3">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`w-11 h-11 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <FaArrowUp className="text-sm" />
      </button>

      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20b857] text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all duration-200 hover:scale-110"
      >
        <FaWhatsapp className="text-2xl" />
      </a>
    </div>
  );
};

export default FloatingButtons;
