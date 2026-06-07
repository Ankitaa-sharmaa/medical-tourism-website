import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import { FaArrowRight, FaStar, FaClock, FaGlobe, FaUserMd } from "react-icons/fa";
import AnimatedCounter from "../components/AnimatedCounter";
import api, { mediaUrl } from "../api";

// ── Static fallback (shown while API loads or on error) ─────────
const FALLBACK_DOCTORS = [
  {
    _id: "f1",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Sarah Johnson", role: "Senior Cardiologist", specialty: "Cardiology",
    exp: "18 Yrs", rating: 4.9, hospital: "Fortis Heart Institute, Mumbai",
    langs: "English, Hindi",
    bio: "Fellowship-trained at Cleveland Clinic, USA. Specialist in complex coronary interventions and heart failure management.",
    available: true,
  },
  {
    _id: "f2",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Michael Lee", role: "Consultant Neurologist", specialty: "Neurology",
    exp: "14 Yrs", rating: 4.8, hospital: "Apollo Hospitals, Delhi",
    langs: "English, Mandarin",
    bio: "Johns Hopkins fellow with expertise in epilepsy, movement disorders, and neurovascular surgery.",
    available: true,
  },
  {
    _id: "f3",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Emily Davis", role: "Orthopedic Surgeon", specialty: "Orthopedics",
    exp: "12 Yrs", rating: 4.9, hospital: "Manipal Hospital, Bangalore",
    langs: "English",
    bio: "Harvard Medical School fellow specialising in robotic-assisted knee and hip replacement.",
    available: false,
  },
  {
    _id: "f4",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Raj Patel", role: "Dental Surgeon & Implantologist", specialty: "Dental",
    exp: "10 Yrs", rating: 4.9, hospital: "Kaya Dental, Hyderabad",
    langs: "English, Hindi, Gujarati",
    bio: "MDS in Prosthodontics with advanced training in full-mouth rehabilitation and All-on-4 implants.",
    available: true,
  },
  {
    _id: "f5",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Arjun Mehta", role: "General & Laparoscopic Surgeon", specialty: "Surgery",
    exp: "11 Yrs", rating: 4.7, hospital: "Global Hospitals, Chennai",
    langs: "English, Tamil, Hindi",
    bio: "FRCS (Edinburgh) with expertise in bariatric surgery, advanced laparoscopy, and oncological resections.",
    available: true,
  },
  {
    _id: "f6",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Priya Sharma", role: "Medical Oncologist", specialty: "Oncology",
    exp: "16 Yrs", rating: 4.8, hospital: "Tata Memorial Centre, Mumbai",
    langs: "English, Hindi, Marathi",
    bio: "Senior oncologist specialising in breast, colorectal, and haematological malignancies.",
    available: true,
  },
];

const SPECIALTIES = ["All", "Cardiology", "Neurology", "Orthopedics", "Dental", "Surgery", "Oncology"];

// ── Skeleton card ──────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-64 bg-slate-200 w-full" />
    <div className="p-6 space-y-3">
      <div className="h-5 w-36 bg-slate-200 rounded" />
      <div className="h-3.5 w-24 bg-slate-100 rounded" />
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-4/5 bg-slate-100 rounded" />
      <div className="h-10 w-full bg-slate-100 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState("All");

  useEffect(() => {
    api.get("/doctors")
      .then(({ data }) => {
        setDoctors(Array.isArray(data) && data.length > 0 ? data : FALLBACK_DOCTORS);
      })
      .catch(() => setDoctors(FALLBACK_DOCTORS))
      .finally(() => {
        setLoading(false);
        setTimeout(() => AOS.refresh(), 100);
      });
  }, []);

  useEffect(() => { if (!loading) AOS.refresh(); }, [loading]);

  const handleFilter = s => {
    setActive(s);
    setTimeout(() => AOS.refresh(), 50);
  };

  const filtered = active === "All"
    ? doctors
    : doctors.filter(d => d.specialty === active);

  return (
    <>
      {/* ── PAGE BANNER ── */}
      <section
        className="relative h-[68vh] bg-cover bg-center flex items-end pb-24"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-800/30" />
        <div className="relative z-10 px-6 md:px-20" data-aos="fade-up">
          <p className="text-cyan-400 text-xs tracking-[5px] font-semibold uppercase mb-4">Our Doctors</p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
            Meet Our<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">Specialists</span>
          </h1>
          <p className="text-slate-300 mt-5 text-lg max-w-xl leading-relaxed">
            Internationally trained doctors at India's top JCI-accredited hospitals, ready to provide world-class care.
          </p>
        </div>
      </section>

      {/* ── FILTER + DOCTORS ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="text-center mb-12" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">Our Team</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Browse by Specialty</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-14" data-aos="fade-up" data-aos-delay="100">
          {SPECIALTIES.map(s => (
            <button key={s} onClick={() => handleFilter(s)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === s
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Doctor cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-7">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-7">
            {filtered.map((doc, i) => (
              <div key={doc._id || doc.name}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col shadow-sm"
                data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="relative">
                  <img
                    src={mediaUrl(doc.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e0f2fe&color=0369a1&size=400`}
                    alt={doc.name}
                    loading="lazy"
                    className="h-64 w-full object-cover object-top"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=e0f2fe&color=0369a1&size=400`; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                    doc.available
                      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                      : "bg-red-400/20 text-red-200 border border-red-400/30"
                  }`}>
                    {doc.available ? "● Available" : "● Booked"}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-cyan-500/20 border border-cyan-300/30 text-cyan-200 text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                      {doc.specialty}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-cyan-600 text-sm mt-1">{doc.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mt-3 flex-1">{doc.bio}</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <FaStar className="text-yellow-400" />
                      <span className="font-bold text-slate-900">{Number(doc.rating || 0).toFixed(1)}</span>
                      <span className="text-slate-300">·</span>
                      <FaClock className="text-slate-400" />
                      <span>{doc.exp} Exp.</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <FaUserMd className="text-cyan-500 flex-shrink-0" />
                      <span>{doc.hospital}</span>
                    </div>
                    {doc.langs && (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <FaGlobe className="text-cyan-500 flex-shrink-0" />
                        <span>{doc.langs}</span>
                      </div>
                    )}
                  </div>

                  <Link to="/contact"
                    className="mt-5 block text-center w-full bg-cyan-50 hover:bg-cyan-500 border border-cyan-200 hover:border-cyan-500 text-cyan-700 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">No specialists found in this category.</div>
        )}
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="px-6 md:px-20 py-16 bg-slate-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 200, suffix: "+",  label: "Verified Specialists" },
            { target: 4.8, suffix: "★", decimals: 1, label: "Average Doctor Rating" },
            { target: 12,  suffix: "+",  label: "Years Avg. Experience" },
            { target: 100, suffix: "%",  label: "Internationally Trained" },
          ].map((s, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
              <p className="text-3xl md:text-4xl font-black text-cyan-600">
                <AnimatedCounter target={s.target} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="text-slate-500 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOIN NETWORK ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div className="relative bg-gradient-to-br from-sky-50 via-cyan-50 to-white border border-sky-200 rounded-3xl p-12 md:p-16 overflow-hidden shadow-sm" data-aos="fade-up">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-300 opacity-12 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">For Doctors</p>
              <h2 className="text-4xl font-black mb-4 leading-tight text-slate-900">Are You a Specialist?<br />Join Our Network</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                We partner with internationally trained doctors across India. Join MedTour's network to connect with global patients seeking your expertise.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 transition-all hover:scale-105">
                Apply to Join <FaArrowRight />
              </Link>
              <Link to="/about" className="border border-slate-300 px-8 py-4 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition inline-flex items-center justify-center gap-2">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
