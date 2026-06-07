import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaWhatsapp,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

const SERVICES_LIST = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dental Care",
  "Eye Care",
  "General Surgery",
  "Oncology",
  "Preventive / Wellness",
  "Other / Not Sure",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Saudi Arabia",
  "Bangladesh",
  "Nigeria",
  "Kenya",
  "Other",
];

const INFO_CARDS = [
  {
    icon: <FaPhoneAlt />,
    title: "Call Us",
    line1: "+91 98765 43210",
    line2: "Mon–Sat, 8am–8pm IST",
    href: "tel:+919876543210",
    color: "bg-cyan-500",
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    line1: "+91 98765 43210",
    line2: "Instant response, 24/7",
    href: "https://wa.me/919876543210",
    color: "bg-emerald-500",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Us",
    line1: "support@medtour.com",
    line2: "We reply within 24 hours",
    href: "mailto:support@medtour.com",
    color: "bg-violet-500",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Our Office",
    line1: "123 Healthcare Blvd",
    line2: "Mumbai, India 400001",
    href: "#",
    color: "bg-orange-500",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  preferredDate: "",
  message: "",
};

const Contact = () => {
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [toast,   setToast]   = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/appointments", {
        fullName:      form.name.trim(),
        email:         form.email.trim(),
        phone:         form.phone.trim(),
        country:       form.country,
        service:       form.service,
        preferredDate: form.preferredDate,
        message:       form.message.trim(),
      });
      setToast(form.name.trim() || "there");
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* ── SUCCESS TOAST ── */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] flex items-start gap-3 bg-emerald-600 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-emerald-900/30 max-w-sm animate-[slide-in-from-right_0.3s_ease]">
          <FaCheckCircle className="flex-shrink-0 mt-0.5 text-emerald-200 text-lg" />
          <div className="flex-1">
            <p className="font-bold text-sm">Message Received!</p>
            <p className="text-emerald-100 text-xs mt-0.5">
              Thanks, <span className="font-semibold text-white">{toast}</span>. We'll contact you within 24 hours.
            </p>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-emerald-500 rounded-lg transition flex-shrink-0">
            <FaTimes className="text-xs text-emerald-200" />
          </button>
        </div>
      )}

      {/* ── PAGE BANNER ── */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-end pb-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-800/30" />
        <div className="relative z-10 px-6 md:px-20">
          <p className="text-cyan-400 text-xs tracking-[5px] font-semibold uppercase mb-4">
            Contact Us
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
            Let's Plan Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
              Health Journey
            </span>
          </h1>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
          {INFO_CARDS.map((card, i) => (
            <a
              key={i}
              href={card.href}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 transition-all duration-200 group block shadow-sm"
            >
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center text-white text-lg mb-4 shadow-sm`}>
                {card.icon}
              </div>
              <p className="font-bold text-base mb-1 text-slate-900">{card.title}</p>
              <p className="text-slate-600 text-sm">{card.line1}</p>
              <p className="text-slate-400 text-xs mt-1">{card.line2}</p>
            </a>
          ))}
        </div>

        {/* ── FORM + SIDE INFO ── */}
        <div className="grid md:grid-cols-3 gap-12 items-start">

          {/* Form — spans 2 cols */}
          <div className="md:col-span-2">
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
              Free Consultation
            </p>
            <h2 className="text-4xl font-black mb-8 text-slate-900">Tell Us About Your Case</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 placeholder-slate-400 transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@email.com"
                    required
                    className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 placeholder-slate-400 transition shadow-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                    className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 placeholder-slate-400 transition shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 transition appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Treatment Interest
                  </label>
                  <div className="relative">
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 transition appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">Select a specialty</option>
                      {SERVICES_LIST.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 transition shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                  Tell Us More *
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Briefly describe your condition, diagnosis, or treatment needed. Any medical reports or prior history is helpful."
                  required
                  className="w-full bg-white border border-slate-300 focus:border-cyan-400 rounded-xl px-5 py-3.5 outline-none text-sm text-slate-900 placeholder-slate-400 resize-none transition shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-white px-10 py-4 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>Send Message <FaArrowRight className="text-xs" /></>
                )}
              </button>

              <p className="text-slate-400 text-xs">
                * We typically respond within 24 hours. Your information is kept strictly confidential.
              </p>
            </form>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <h3 className="font-bold text-lg mb-5 text-slate-900">Office Hours</h3>
              <div className="space-y-3 text-sm">
                {[
                  { day: "Monday – Friday", hours: "8:00 am – 8:00 pm IST" },
                  { day: "Saturday", hours: "9:00 am – 6:00 pm IST" },
                  { day: "Sunday", hours: "Emergency only" },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between items-center">
                    <span className="text-slate-500">{h.day}</span>
                    <span className="text-slate-900 font-medium text-xs">{h.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-200 flex items-center gap-3 text-sm">
                <FaClock className="text-cyan-500" />
                <span className="text-slate-500">24/7 emergency helpline available</span>
              </div>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-3xl p-7">
              <h3 className="font-bold text-lg mb-3 text-slate-900">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  "We review your case with our medical team",
                  "A coordinator calls you within 24 hrs",
                  "We share a personalised treatment plan",
                  "You decide — no pressure, no fees",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold border border-cyan-200">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Quick Links</h3>
              <div className="space-y-3 text-sm text-slate-500">
                {[
                  { label: "View all services", to: "/services" },
                  { label: "Meet our doctors", to: "/doctors" },
                  { label: "About MedTour", to: "/about" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center justify-between hover:text-cyan-600 transition group"
                  >
                    <span>{link.label}</span>
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Contact;
