import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import {
  FaArrowRight, FaHeartbeat, FaUserMd, FaHospital, FaSmile,
  FaShieldAlt, FaStethoscope, FaEye, FaCheckCircle, FaTimes,
} from "react-icons/fa";
import api from "../api";

// ── Category → visual style (used for API-fetched services) ──────
const CATEGORY_STYLE = {
  Surgery: {
    icon: <FaHeartbeat />,
    gradient: "from-rose-50 to-rose-100/40",
    border: "border-rose-200",
    iconBg: "bg-rose-500",
  },
  Dental: {
    icon: <FaSmile />,
    gradient: "from-emerald-50 to-emerald-100/40",
    border: "border-emerald-200",
    iconBg: "bg-emerald-500",
  },
  Eye: {
    icon: <FaEye />,
    gradient: "from-blue-50 to-blue-100/40",
    border: "border-blue-200",
    iconBg: "bg-blue-500",
  },
  Wellness: {
    icon: <FaShieldAlt />,
    gradient: "from-teal-50 to-teal-100/40",
    border: "border-teal-200",
    iconBg: "bg-teal-500",
  },
};

// ── Static fallback (shown while loading or when API is unreachable) ──
const FALLBACK_SERVICES = [
  {
    _id: "s1", category: "Surgery",
    icon: <FaHeartbeat />, gradient: "from-rose-50 to-rose-100/40",
    border: "border-rose-200", iconBg: "bg-rose-500",
    title: "Cardiology",
    desc: "Comprehensive cardiac care including coronary bypass surgery, angioplasty, valve replacement, and heart transplants performed by internationally trained cardiologists.",
    features: ["Coronary Bypass Surgery", "Angioplasty & Stenting", "Valve Replacement", "Heart Transplant"],
    from: "₹1,50,000", tag: "Most Popular",
  },
  {
    _id: "s2", category: "Surgery",
    icon: <FaUserMd />, gradient: "from-violet-50 to-violet-100/40",
    border: "border-violet-200", iconBg: "bg-violet-500",
    title: "Neurology & Brain Surgery",
    desc: "Advanced neurological treatments performed by fellowship-trained neurosurgeons — from complex brain tumour removal to minimally invasive spine interventions.",
    features: ["Brain Tumour Surgery", "Epilepsy Treatment", "Spine Surgery", "Stroke Rehabilitation"],
    from: "₹2,00,000", tag: null,
  },
  {
    _id: "s3", category: "Surgery",
    icon: <FaHospital />, gradient: "from-sky-50 to-sky-100/40",
    border: "border-sky-200", iconBg: "bg-cyan-500",
    title: "Orthopedics",
    desc: "Robotic-assisted joint replacements, complex spine surgeries, sports medicine, and ACL reconstructions at India's top orthopaedic centres.",
    features: ["Knee & Hip Replacement", "Robotic Surgery", "Spine Fusion", "Sports Injuries"],
    from: "₹1,80,000", tag: null,
  },
  {
    _id: "s4", category: "Dental",
    icon: <FaSmile />, gradient: "from-emerald-50 to-emerald-100/40",
    border: "border-emerald-200", iconBg: "bg-emerald-500",
    title: "Dental Care",
    desc: "Full-spectrum dental services from cosmetic veneers and dental implants to full-mouth reconstruction and Invisalign — all at a fraction of Western prices.",
    features: ["Dental Implants", "Veneers & Crowns", "Full-Mouth Rehab", "Invisalign"],
    from: "₹15,000", tag: "Great Value",
  },
  {
    _id: "s5", category: "Surgery",
    icon: <FaStethoscope />, gradient: "from-orange-50 to-orange-100/40",
    border: "border-orange-200", iconBg: "bg-orange-500",
    title: "General Surgery",
    desc: "Minimally invasive laparoscopic procedures, weight-loss surgery, cancer resections, and hernia repairs by experienced general and oncological surgeons.",
    features: ["Laparoscopic Surgery", "Bariatric Surgery", "Cancer Resection", "Hernia Repair"],
    from: "₹80,000", tag: null,
  },
  {
    _id: "s6", category: "Eye",
    icon: <FaEye />, gradient: "from-blue-50 to-blue-100/40",
    border: "border-blue-200", iconBg: "bg-blue-500",
    title: "Eye Care",
    desc: "State-of-the-art ophthalmology treatments including LASIK laser correction, cataract removal, glaucoma management, and corneal transplants.",
    features: ["LASIK Correction", "Cataract Surgery", "Glaucoma Treatment", "Corneal Transplant"],
    from: "₹25,000", tag: null,
  },
  {
    _id: "s7", category: "Wellness",
    icon: <FaShieldAlt />, gradient: "from-teal-50 to-teal-100/40",
    border: "border-teal-200", iconBg: "bg-teal-500",
    title: "Preventive & Wellness",
    desc: "Executive health check packages, full-body screening, cancer markers, cardiac risk assessment, and personalised wellness programs.",
    features: ["Full-Body Screening", "Cancer Markers", "Cardiac Risk Check", "Wellness Programs"],
    from: "₹8,000", tag: "Quick Turnaround",
  },
];

const FILTERS = ["All", "Surgery", "Dental", "Eye", "Wellness"];

const COMPARE_ROWS = [
  { label: "Cardiac Bypass Surgery",      us: "$80,000–$150,000", india: "₹4,00,000–₹6,00,000" },
  { label: "Knee Replacement",            us: "$30,000–$60,000",  india: "₹1,80,000–₹2,50,000" },
  { label: "Dental Implants (per tooth)", us: "$3,000–$5,000",    india: "₹20,000–₹40,000"     },
  { label: "LASIK (both eyes)",           us: "$4,000–$6,000",    india: "₹30,000–₹50,000"     },
  { label: "Neurosurgery (brain tumour)", us: "$100,000+",        india: "₹5,00,000–₹8,00,000" },
];

// ── Skeleton card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 animate-pulse">
    <div className="w-14 h-14 bg-slate-200 rounded-2xl mb-6" />
    <div className="h-5 w-40 bg-slate-200 rounded mb-3" />
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-4/5 bg-slate-100 rounded" />
      <div className="h-3 w-3/4 bg-slate-100 rounded" />
    </div>
    <div className="space-y-2 mb-6">
      {[1,2,3,4].map(i => <div key={i} className="h-3 w-1/2 bg-slate-100 rounded" />)}
    </div>
    <div className="flex justify-between items-center pt-5 border-t border-slate-200">
      <div className="h-6 w-24 bg-slate-200 rounded" />
      <div className="h-9 w-24 bg-slate-100 rounded-xl" />
    </div>
  </div>
);

const Services = () => {
  const [services,     setServices]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    api.get("/services")
      .then(({ data }) => {
        setServices(data.length > 0 ? data : FALLBACK_SERVICES);
      })
      .catch(() => setServices(FALLBACK_SERVICES))
      .finally(() => {
        setLoading(false);
        setTimeout(() => AOS.refresh(), 100);
      });
  }, []);

  const handleFilter = (f) => {
    setActiveFilter(f);
    setTimeout(() => AOS.refresh(), 50);
  };

  const filtered = activeFilter === "All"
    ? services
    : services.filter((s) => s.category === activeFilter);

  return (
    <>
      {/* ── PAGE BANNER ── */}
      <section
        className="relative h-[68vh] bg-cover bg-center flex items-end pb-24"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-800/30" />
        <div className="relative z-10 px-6 md:px-20" data-aos="fade-up">
          <p className="text-cyan-400 text-xs tracking-[5px] font-semibold uppercase mb-4">Our Services</p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
            World-Class<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
              Medical Treatments
            </span>
          </h1>
          <p className="text-slate-300 mt-5 text-lg max-w-xl leading-relaxed">
            Access India's finest specialists and hospitals across every major medical specialty — at up to 80% lower cost.
          </p>
        </div>
      </section>

      {/* ── FILTER + SERVICES GRID ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">All Specialties</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Browse by Category</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-14" data-aos="fade-up" data-aos-delay="100">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((s, i) => {
              // Static fallback items carry inline styles; API items use category map
              const style    = CATEGORY_STYLE[s.category] || CATEGORY_STYLE.Surgery;
              const icon     = s.icon     || style.icon;
              const gradient = s.gradient || style.gradient;
              const border   = s.border   || style.border;
              const iconBg   = s.iconBg   || style.iconBg;

              return (
                <div
                  key={s._id || s.title}
                  className={`bg-gradient-to-br ${gradient} border ${border} p-8 rounded-3xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group relative`}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  {s.tag && (
                    <span className="absolute top-6 right-6 bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs px-3 py-1 rounded-full font-semibold">
                      {s.tag}
                    </span>
                  )}
                  <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-sm`}>
                    {icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.desc}</p>
                  {s.features?.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {s.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-slate-700 text-sm">
                          <FaCheckCircle className="text-cyan-500 text-xs flex-shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                    <div>
                      <p className="text-slate-400 text-xs">Starting from</p>
                      <p className="text-slate-900 font-bold text-lg">{s.from || '—'}</p>
                    </div>
                    <Link
                      to="/contact"
                      className="bg-white hover:bg-cyan-500 border border-slate-300 hover:border-cyan-500 text-slate-700 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm"
                    >
                      Enquire <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">No services found in this category.</div>
        )}
      </section>

      {/* ── COST COMPARISON ── */}
      <section className="px-6 md:px-20 py-24 bg-slate-50">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">Cost Comparison</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">See How Much You Save</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-base">
            Indicative costs — actual quotes provided after free consultation
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden border border-slate-200 rounded-3xl shadow-sm bg-white" data-aos="fade-up" data-aos-delay="100">
          <div className="grid grid-cols-3 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 border-b border-slate-200">
            <span>Treatment</span>
            <span className="text-center">🇺🇸 USA Cost</span>
            <span className="text-center text-cyan-600">🇮🇳 MedTour Cost</span>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 px-6 py-5 text-sm items-center border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
              <span className="text-slate-700 font-medium">{row.label}</span>
              <span className="text-center text-red-500 font-semibold">{row.us}</span>
              <span className="text-center text-emerald-600 font-bold">{row.india}</span>
            </div>
          ))}
          <div className="bg-cyan-50 border-t border-cyan-200 px-6 py-4 text-center text-sm text-cyan-700 font-medium">
            Average savings: 70–85% compared to US prices · All-inclusive of hospital, surgeon & anesthesia fees
          </div>
        </div>
      </section>

      {/* ── WHY MEDTOUR ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">
              Not Just a Booking<br />Platform. A Care Partner.
            </h2>
            <p className="text-slate-600 leading-relaxed text-base mb-8">
              Unlike generic medical tourism brokers, MedTour employs in-house medical advisors, multilingual care
              coordinators, and dedicated travel specialists. We manage every detail — from second medical opinions to
              post-discharge telemedicine — so you never feel alone in a foreign country.
            </p>
            <div className="space-y-4">
              {[
                { tick: true,  label: "In-house medical team reviews every case" },
                { tick: true,  label: "No referral commissions — we recommend what's best" },
                { tick: true,  label: "Contractual price guarantee before you travel" },
                { tick: false, label: "Generic booking sites with no medical oversight" },
                { tick: false, label: "Hidden fees revealed only on arrival" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {item.tick
                    ? <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                    : <FaTimes className="text-red-400 flex-shrink-0" />}
                  <span className={item.tick ? "text-slate-700" : "text-slate-400 line-through"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=800&auto=format&fit=crop"
              alt="Care team"
              loading="lazy"
              className="rounded-3xl object-cover h-[460px] w-full shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <div className="relative bg-gradient-to-br from-sky-50 via-cyan-50 to-white border border-sky-200 rounded-3xl p-12 text-center overflow-hidden shadow-sm" data-aos="fade-up">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-cyan-300 opacity-15 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 text-slate-900">Not Sure Which Treatment?</h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Our medical advisors will review your case for free and recommend the right hospital, specialist, and treatment plan for you.
            </p>
            <Link to="/contact" className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105">
              Get Free Medical Opinion <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
