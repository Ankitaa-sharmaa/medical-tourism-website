import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import {
  FaArrowRight,
  FaHeartbeat,
  FaHospital,
  FaUserMd,
  FaStar,
  FaChevronDown,
  FaShieldAlt,
  FaGlobe,
  FaPhoneAlt,
  FaCheckCircle,
  FaStethoscope,
  FaSmile,
  FaAward,
  FaClock,
  FaPlane,
} from "react-icons/fa";

const SERVICES = [
  {
    icon: <FaHeartbeat />,
    title: "Cardiology",
    desc: "World-class cardiac care including bypass surgery, angioplasty, and heart transplants from top-rated cardiologists.",
    gradient: "from-rose-50 to-rose-100/40",
    border: "border-rose-200",
    iconBg: "bg-rose-500",
  },
  {
    icon: <FaUserMd />,
    title: "Neurology",
    desc: "Advanced neurological treatments including brain tumor surgery, epilepsy care, and stroke rehabilitation.",
    gradient: "from-violet-50 to-violet-100/40",
    border: "border-violet-200",
    iconBg: "bg-violet-500",
  },
  {
    icon: <FaHospital />,
    title: "Orthopedics",
    desc: "Joint replacements, spine surgery, and sports medicine with cutting-edge robotic-assisted procedures.",
    gradient: "from-sky-50 to-sky-100/40",
    border: "border-sky-200",
    iconBg: "bg-cyan-500",
  },
  {
    icon: <FaSmile />,
    title: "Dental Care",
    desc: "Premium cosmetic and restorative dentistry, dental implants, veneers, and full-mouth rehabilitation.",
    gradient: "from-emerald-50 to-emerald-100/40",
    border: "border-emerald-200",
    iconBg: "bg-emerald-500",
  },
  {
    icon: <FaStethoscope />,
    title: "General Surgery",
    desc: "Minimally invasive laparoscopic surgeries, cancer resections, and bariatric procedures by expert surgeons.",
    gradient: "from-orange-50 to-orange-100/40",
    border: "border-orange-200",
    iconBg: "bg-orange-500",
  },
  {
    icon: <FaShieldAlt />,
    title: "Preventive Care",
    desc: "Comprehensive health packages, executive health check-ups, and personalised wellness programs.",
    gradient: "from-blue-50 to-blue-100/40",
    border: "border-blue-200",
    iconBg: "bg-blue-500",
  },
];

const DOCTORS = [
  {
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Sarah Johnson",
    role: "Senior Cardiologist",
    exp: "18 Yrs Exp.",
    rating: 4.9,
    reviews: 342,
    available: true,
  },
  {
    img: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a41?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Michael Lee",
    role: "Neurologist",
    exp: "14 Yrs Exp.",
    rating: 4.8,
    reviews: 218,
    available: true,
  },
  {
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=600&auto=format&fit=crop",
    name: "Dr. Emily Davis",
    role: "Orthopedic Surgeon",
    exp: "12 Yrs Exp.",
    rating: 4.9,
    reviews: 287,
    available: false,
  },
];

const FAQS = [
  {
    q: "How do I book a treatment with MedTour?",
    a: "Simply fill out our online consultation form, and our care coordinators will contact you within 24 hours. We'll assess your needs, suggest the best hospitals and doctors, and guide you through the entire process — from booking to discharge.",
  },
  {
    q: "Do you provide visa and travel assistance?",
    a: "Yes, we offer end-to-end travel assistance including medical visa support, airport pickup, hotel arrangements, and local transportation. Our dedicated travel team ensures a completely stress-free journey.",
  },
  {
    q: "Are the hospitals internationally accredited?",
    a: "All partner hospitals are JCI (Joint Commission International) or NABH accredited, meeting the highest global healthcare standards. We thoroughly vet every facility for quality, safety, and patient outcomes.",
  },
  {
    q: "How much can I save compared to my home country?",
    a: "Medical treatments through MedTour can cost 50–80% less than in the US, UK, or Australia — without compromising quality. We provide upfront transparent pricing with absolutely no hidden fees.",
  },
  {
    q: "Is there support available after I return home?",
    a: "Absolutely. We provide post-treatment follow-up through telemedicine consultations, medical report sharing with your local doctor, and a 24/7 helpline for any post-operative concerns.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sophia Miller",
    title: "Cardiac Patient · USA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "I had open heart surgery at a fraction of the US cost. The hospital was world-class, the care team was incredibly professional, and MedTour handled everything — visa, travel, accommodation. Truly life-changing.",
  },
  {
    name: "James Thornton",
    title: "Knee Replacement · UK",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "The orthopaedic team was exceptional. My knee replacement was seamless. I saved over £15,000 compared to private care in London, and the recovery centre was like a five-star hotel.",
  },
  {
    name: "Amira Hassan",
    title: "Dental Implants · UAE",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    text: "I was nervous about getting dental implants abroad, but MedTour made me feel completely safe. The dentist was brilliant, English-speaking, and the whole process was smooth from consultation to follow-up.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Free Consultation",
    desc: "Speak with our medical coordinators to discuss your health needs and explore treatment options.",
    icon: <FaPhoneAlt />,
  },
  {
    num: "02",
    title: "Treatment Planning",
    desc: "We match you with the best specialists and hospitals, and provide a clear cost estimate.",
    icon: <FaStethoscope />,
  },
  {
    num: "03",
    title: "Travel & Arrival",
    desc: "We arrange your visa, flights, accommodation, and airport transfer — completely taken care of.",
    icon: <FaPlane />,
  },
  {
    num: "04",
    title: "Recover & Return",
    desc: "World-class treatment with post-care follow-ups and telemedicine support after you go home.",
    icon: <FaCheckCircle />,
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-800/50" />
        <div className="absolute top-32 left-16 w-96 h-96 bg-cyan-400 opacity-8 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-24 right-16 w-80 h-80 bg-sky-500 opacity-8 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 px-6 md:px-20 pt-28 pb-16 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-200 text-sm font-medium mb-8">
                <FaShieldAlt className="text-xs" />
                Trusted by 15,000+ patients worldwide
              </div>

              <h1 className="text-5xl md:text-[4.5rem] font-black leading-[1.05] tracking-tight text-white">
                World-Class
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-300">
                  Healthcare,
                </span>
                <br />
                Any Budget.
              </h1>

              <p className="mt-7 text-lg text-slate-300 leading-relaxed max-w-lg">
                Connect with top-rated specialists at India's premier JCI-accredited
                hospitals. Save up to 80% versus Western prices — zero compromise on quality.
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link
                  to="/contact"
                  className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold text-[15px] flex items-center gap-2 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/25"
                >
                  Book Free Consultation
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  to="/services"
                  className="border border-white/25 px-8 py-4 rounded-full text-slate-200 hover:text-white hover:bg-white/10 transition-all text-[15px]"
                >
                  Explore Treatments
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-white/10">
                {[
                  { icon: <FaAward />, label: "JCI Accredited" },
                  { icon: <FaShieldAlt />, label: "ISO Certified" },
                  { icon: <FaGlobe />, label: "70+ Countries" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 text-base">{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </div>

              <div className="flex gap-10 mt-10">
                {[
                  { target: 15, suffix: "K+", label: "Patients Served" },
                  { target: 200, suffix: "+", label: "Specialists" },
                  { target: 80, suffix: "+", label: "Hospitals" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-3xl font-black text-cyan-400">
                      <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex justify-center relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop"
                  alt="Doctor"
                  className="w-[400px] h-[520px] object-cover rounded-[32px] shadow-2xl"
                />
                <div className="absolute inset-0 rounded-[32px] ring-1 ring-white/10" />
              </div>

              <div className="absolute -bottom-6 -left-10 bg-white text-slate-900 p-5 rounded-2xl shadow-2xl w-60">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-3 rounded-xl text-rose-500 text-xl">
                    <FaHeartbeat />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Heart Surgery</p>
                    <p className="text-slate-500 text-xs">Saved $42,000</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-8 bg-white border border-slate-200 text-slate-900 p-4 rounded-2xl shadow-xl w-48">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                    <FaStar className="text-sm" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">4.9 / 5 Rating</p>
                    <p className="text-slate-500 text-xs">2,400+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 md:px-20 py-24 bg-slate-50">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
            Simple Process
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">How It Works</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-base">
            Your journey to better health in 4 straightforward steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-10 relative">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="text-center group relative"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-9 left-[55%] w-full h-px bg-gradient-to-r from-cyan-300/70 to-transparent z-0" />
              )}
              <div className="relative z-10 inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 text-xl mb-5 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all duration-300 mx-auto shadow-sm">
                {step.icon}
              </div>
              <p className="text-xs font-bold text-cyan-400 tracking-widest mb-2">{step.num}</p>
              <h3 className="text-lg font-bold mb-3 text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
            Our Specialties
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">World-Class Treatments</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base">
            Explore the full range of medical specialties available through MedTour's
            partner network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${s.gradient} border ${s.border} p-8 rounded-3xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center text-white text-xl mb-6 shadow-sm`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{s.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.desc}</p>
              <span className="text-cyan-600 text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                Learn More <FaArrowRight className="text-xs" />
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12" data-aos="fade-up">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 border border-slate-300 px-7 py-3 rounded-full text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            View All Treatments <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </section>

      {/* ── DOCTORS ── */}
      <section className="px-6 md:px-20 py-24 bg-slate-50">
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
          data-aos="fade-up"
        >
          <div>
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
              Expert Team
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Meet Our Specialists</h2>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 border border-slate-300 px-5 py-2.5 rounded-full text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition self-start md:self-auto"
          >
            View All Doctors <FaArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {DOCTORS.map((doc, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-300 shadow-sm"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="relative">
                <img
                  src={doc.img}
                  alt={doc.name}
                  className="h-64 w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                    doc.available
                      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                      : "bg-red-400/20 text-red-200 border border-red-400/30"
                  }`}
                >
                  {doc.available ? "● Available" : "● Booked"}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{doc.name}</h3>
                <p className="text-cyan-600 text-sm mt-1">{doc.role}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-sm font-bold text-slate-900">{doc.rating}</span>
                    <span className="text-slate-400 text-xs">({doc.reviews})</span>
                  </div>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <FaClock className="text-slate-400 text-[10px]" /> {doc.exp}
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="mt-5 block text-center w-full bg-cyan-50 hover:bg-cyan-500 border border-cyan-200 hover:border-cyan-500 text-cyan-700 hover:text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="md:sticky md:top-32" data-aos="fade-right">
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
              Got Questions?
            </p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900">
              Frequently
              <br />
              Asked
              <br />
              Questions
            </h2>
            <p className="text-slate-500 mt-5 leading-relaxed text-base max-w-sm">
              Everything you need to know before starting your medical journey with us.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
            >
              Ask Us Anything <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="space-y-3" data-aos="fade-left">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === i
                    ? "border-cyan-300 bg-cyan-50"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4"
                >
                  <span className="font-semibold text-[15px] leading-snug text-slate-900">{faq.q}</span>
                  <span
                    className={`text-cyan-500 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  >
                    <FaChevronDown className="text-sm" />
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 md:px-20 py-24 bg-slate-50">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
            Patient Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            Real Experiences,
            <br />
            Real Results
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 flex flex-col shadow-sm"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <FaStar key={j} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed text-sm flex-1">"{t.text}"</p>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-200">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-[15px] text-slate-900">{t.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <div
          className="relative bg-gradient-to-br from-sky-50 via-cyan-50 to-white border border-sky-200 rounded-3xl p-12 md:p-20 overflow-hidden text-center shadow-sm"
          data-aos="fade-up"
        >
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-300 opacity-15 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight text-slate-900">
              Ready to Start Your
              <br />
              <span className="text-cyan-600">Medical Journey?</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get a free consultation with our medical coordinators today. No commitment,
              no hidden fees.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/30"
              >
                Get Free Consultation <FaArrowRight />
              </Link>
              <a
                href="tel:+919876543210"
                className="border border-slate-300 px-8 py-4 rounded-full hover:bg-slate-100 transition flex items-center gap-2 text-slate-700 hover:text-slate-900"
              >
                <FaPhoneAlt className="text-cyan-500 text-sm" /> +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
