import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

const SharedFooter = () => {
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubbed(true);
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700/50 px-6 md:px-20 pt-16 pb-8">

      {/* ── Newsletter ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-14 mb-14 border-b border-slate-700/50">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
          <p className="text-slate-400 text-sm max-w-xs">
            Health tips, treatment guides, and patient stories — delivered monthly.
          </p>
        </div>

        {!subbed ? (
          <form
            onSubmit={handleSubscribe}
            className="flex gap-3 w-full md:w-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-white/8 border border-slate-700 focus:border-cyan-500/60 rounded-full px-5 py-2.5 outline-none text-sm text-white placeholder-slate-500 transition flex-1 md:w-64"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
            >
              Subscribe <FaArrowRight className="text-xs" />
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <FaCheckCircle />
            You're subscribed — thanks for joining!
          </div>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid md:grid-cols-4 gap-12 mb-14">

        <div>
          <Link to="/" className="text-2xl font-black">
            <span className="text-cyan-400">Med</span>
            <span className="text-white">Tour</span>
          </Link>
          <p className="text-slate-400 mt-5 text-sm leading-relaxed">
            India's most trusted medical tourism platform connecting global
            patients with world-class healthcare.
          </p>
          <div className="flex gap-3 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 hover:border-cyan-400 hover:text-cyan-400 transition text-xs"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-5 text-white">Company</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              { label: "About Us", to: "/about" },
              { label: "Our Doctors", to: "/doctors" },
              { label: "Services", to: "/services" },
              { label: "Contact", to: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-cyan-400 transition">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-5 text-white">Treatments</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            {[
              "Heart Surgery",
              "Orthopedics",
              "Neurology",
              "Dental Care",
              "Cosmetic Surgery",
            ].map((t) => (
              <li key={t}>
                <span className="hover:text-cyan-400 transition cursor-pointer">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-5 text-white">Contact Us</h3>
          <div className="space-y-4 text-sm text-slate-400">
            <a
              href="mailto:support@medtour.com"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaEnvelope className="text-cyan-400 flex-shrink-0" />
              support@medtour.com
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaPhoneAlt className="text-cyan-400 flex-shrink-0" />
              +91 98765 43210
            </a>
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>123 Healthcare Blvd, Mumbai, India 400001</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2026 MedTour. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 transition">Cookie Policy</a>
        </div>
      </div>

    </footer>
  );
};

export default SharedFooter;
