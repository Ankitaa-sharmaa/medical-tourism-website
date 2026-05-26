import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import {
  FaArrowRight,
  FaHeartbeat,
  FaUserMd,
  FaGlobe,
  FaShieldAlt,
  FaHandshake,
  FaCheckCircle,
  FaAward,
  FaUsers,
} from "react-icons/fa";

const VALUES = [
  {
    icon: <FaHeartbeat />,
    title: "Patient First",
    desc: "Every decision we make starts with one question: is this the best outcome for the patient? Quality and safety are never negotiated.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Full Transparency",
    desc: "Upfront pricing, honest assessments, and no hidden costs. You know exactly what you're getting before you commit.",
  },
  {
    icon: <FaGlobe />,
    title: "Global Reach",
    desc: "Coordinating care across 70+ countries, with local expertise and multilingual support for every patient, every step of the way.",
  },
  {
    icon: <FaHandshake />,
    title: "Trusted Partnerships",
    desc: "We partner exclusively with JCI and NABH accredited hospitals — the top 5% of healthcare facilities in India.",
  },
];

const ACCREDITATIONS = [
  "JCI Accredited",
  "NABH Certified",
  "ISO 9001:2015",
  "NABL Approved",
  "CRISIL Rated",
];

const PROMISES = [
  "JCI-accredited partner hospitals only",
  "24/7 dedicated care coordinators",
  "Transparent pricing, no hidden fees",
  "End-to-end travel and visa assistance",
  "Post-treatment follow-up and telemedicine",
  "Multilingual patient support team",
];

const About = () => {
  return (
    <>
      {/* ── PAGE BANNER ── */}
      <section
        className="relative h-[72vh] bg-cover bg-center flex items-end pb-24"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-800/30" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-400 opacity-8 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 px-6 md:px-20" data-aos="fade-up">
          <p className="text-cyan-400 text-xs tracking-[5px] font-semibold uppercase mb-4">
            About Us
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
            Redefining
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-sky-400">
              Medical Tourism
            </span>
            <br />
            Globally
          </h1>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
              Our Mission
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">
              Making World-Class
              <br />
              Healthcare Accessible
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4 text-base">
              Founded in 2018, MedTour was born from a simple belief: quality healthcare
              should not be a privilege of geography or wealth. We built a platform that
              connects international patients with India's finest hospitals and specialists
              — offering treatments at 50–80% less than Western prices, without any
              compromise on standards.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-base">
              Today we serve patients from over 70 countries, coordinating complex medical
              journeys from first consultation to safe return home — handling visas,
              accommodation, transport, and post-care, so patients can focus entirely on
              their recovery.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROMISES.map((p) => (
                <div key={p} className="flex items-start gap-3 text-slate-700 text-sm">
                  <FaCheckCircle className="text-cyan-500 flex-shrink-0 mt-0.5" />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="relative" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
              alt="Hospital"
              className="rounded-3xl object-cover h-[500px] w-full shadow-xl"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-slate-200" />
            <div className="absolute -bottom-8 -left-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
              <p className="text-4xl font-black text-cyan-600">
                <AnimatedCounter target={98} suffix="%" />
              </p>
              <p className="text-slate-500 text-sm mt-1">Patient Satisfaction Rate</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-black text-slate-900">2018</p>
              <p className="text-slate-500 text-xs mt-1">Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="px-6 md:px-20 py-16 bg-slate-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 15, suffix: "K+", label: "Patients Served" },
            { target: 200, suffix: "+", label: "Expert Specialists" },
            { target: 80, suffix: "+", label: "Partner Hospitals" },
            { target: 70, suffix: "+", label: "Countries Served" },
          ].map((s, i) => (
            <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
              <p className="text-4xl md:text-5xl font-black text-cyan-600">
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-slate-500 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
            What We Stand For
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Our Core Values</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-base">
            The principles that guide every decision we make for our patients
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="w-12 h-12 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center justify-center text-cyan-600 text-xl mb-5">
                {v.icon}
              </div>
              <h3 className="font-bold text-lg mb-3 text-slate-900">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="px-6 md:px-20 py-24 bg-slate-50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1" data-aos="fade-right">
            <img
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=800&auto=format&fit=crop"
              alt="Our team"
              className="rounded-3xl object-cover h-[440px] w-full shadow-lg"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-slate-200" />
          </div>

          <div className="order-1 md:order-2" data-aos="fade-left">
            <p className="text-cyan-600 text-xs tracking-[5px] font-semibold uppercase mb-4">
              Our Story
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">
              Why We Started
              <br />
              <span className="text-cyan-600">MedTour</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-5 text-base">
              Our founder, Arjun Mehta, watched his family struggle to afford critical
              surgery in the US — even with insurance. Knowing India had equally qualified
              surgeons and state-of-the-art hospitals, he spent two years building
              relationships with the country's top medical institutions.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-base">
              MedTour launched with one hospital partner and three patients. Today, we
              coordinate over 2,000 treatments annually across 80+ partner hospitals, and
              we've never lost sight of why we started: to put world-class healthcare
              within reach of every patient, everywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                <FaAward className="text-cyan-500" />
                <span className="text-sm font-medium text-slate-800">FICCI Award 2024</span>
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                <FaUsers className="text-cyan-500" />
                <span className="text-sm font-medium text-slate-800">50-person Care Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCREDITATIONS ── */}
      <section className="px-6 md:px-20 py-16 bg-white">
        <div className="text-center mb-10" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-slate-900">Internationally Accredited & Recognised</h3>
          <p className="text-slate-500 text-sm mt-2">
            Every partner hospital meets the highest global quality benchmarks
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="100">
          {ACCREDITATIONS.map((badge) => (
            <div
              key={badge}
              className="border border-slate-200 bg-slate-50 hover:border-cyan-300 hover:bg-cyan-50 rounded-2xl px-8 py-4 text-sm font-semibold text-slate-700 hover:text-cyan-700 transition cursor-default shadow-sm"
            >
              {badge}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-20 py-20 bg-slate-50">
        <div
          className="relative bg-gradient-to-br from-sky-50 via-cyan-50 to-white border border-sky-200 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-sm"
          data-aos="fade-up"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-300 opacity-15 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-5 text-slate-900">
              Ready to Begin Your
              <br />
              <span className="text-cyan-600">Health Journey?</span>
            </h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto mb-10">
              Our coordinators are available around the clock to answer your questions and
              help you plan the right treatment path.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all hover:scale-105"
              >
                Get Free Consultation <FaArrowRight />
              </Link>
              <Link
                to="/doctors"
                className="border border-slate-300 px-8 py-4 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition inline-flex items-center gap-2"
              >
                Meet Our Doctors <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
