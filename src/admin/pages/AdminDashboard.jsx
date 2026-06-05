import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import useLocalData from '../hooks/useLocalData';
import { MOCK_TESTIMONIALS, MOCK_QUERIES } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import { FaUserMd, FaCalendarAlt, FaStar, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const STATUS_STYLE = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  new:      'bg-sky-100 text-sky-700',
  resolved: 'bg-slate-100 text-slate-500',
};

const formatDate = iso => {
  if (!iso) return '—';
  const d = iso?.toDate ? iso.toDate() : new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StatCard = ({ icon, label, value, color, sub, to }) => (
  <Link to={to} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group block">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white text-xl shadow-sm`}>{icon}</div>
      <FaArrowRight className="text-slate-300 group-hover:text-cyan-500 transition text-sm" />
    </div>
    <p className="text-3xl font-black text-slate-900">{value ?? <span className="text-slate-300 animate-pulse">—</span>}</p>
    <p className="text-slate-500 text-sm mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </Link>
);

const AdminDashboard = () => {
  // Firestore: doctors + appointments
  const [doctorsCount,   setDoctorsCount]   = useState(null);
  const [apptCount,      setApptCount]      = useState(null);
  const [pendingCount,   setPendingCount]   = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [recentAppts,    setRecentAppts]    = useState([]);
  const [loadingFirestore, setLoadingFirestore] = useState(true);

  // localStorage: testimonials + queries (still local)
  const { items: testimonials } = useLocalData('admin_testimonials', MOCK_TESTIMONIALS);
  const { items: queries }      = useLocalData('admin_queries',      MOCK_QUERIES);
  const openQueries = useMemo(() => queries.filter(q => !q.status || q.status === 'new').length, [queries]);

  useEffect(() => {
    if (!db) { setLoadingFirestore(false); return; }

    // Live counts for doctors
    const unsub1 = onSnapshot(collection(db, 'doctors'), snap => {
      setDoctorsCount(snap.size);
      setAvailableCount(snap.docs.filter(d => d.data().available).length);
    });

    // Live counts + recent for appointments
    const apptQ = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsub2 = onSnapshot(apptQ, snap => {
      setApptCount(snap.size);
      setPendingCount(snap.docs.filter(d => d.data().status === 'pending').length);
      setRecentAppts(snap.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() })));
      setLoadingFirestore(false);
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  const recentQueries = queries.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<FaUserMd />}      label="Total Doctors"    value={doctorsCount} color="bg-cyan-500"    sub={`${availableCount} available`}       to="/admin/doctors" />
        <StatCard icon={<FaCalendarAlt />} label="Appointments"     value={apptCount}    color="bg-violet-500"  sub={`${pendingCount} pending`}            to="/admin/appointments" />
        <StatCard icon={<FaStar />}        label="Testimonials"     value={testimonials.length} color="bg-amber-400" sub="patient reviews"            to="/admin/testimonials" />
        <StatCard icon={<FaEnvelope />}    label="Open Queries"     value={openQueries}  color="bg-emerald-500" sub={`of ${queries.length} total`}        to="/admin/queries" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Recent Appointments (Firestore) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900">Recent Appointments</h2>
              {db && <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>Live</span>}
            </div>
            <Link to="/admin/appointments" className="text-xs text-cyan-600 hover:text-cyan-500 font-semibold flex items-center gap-1">
              View all <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          {loadingFirestore ? (
            <div className="flex items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"/></div>
          ) : recentAppts.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No appointments yet. They appear here when users submit the consultation form.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentAppts.map(a => (
                <div key={a.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm uppercase flex-shrink-0">{a.name?.[0]??'?'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{a.name}</p>
                    <p className="text-xs text-slate-400 truncate">{a.service||'—'} · {formatDate(a.createdAt)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_STYLE[a.status]??STATUS_STYLE.pending}`}>{a.status??'pending'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Queries (localStorage) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">Recent Contact Queries</h2>
            <Link to="/admin/queries" className="text-xs text-cyan-600 hover:text-cyan-500 font-semibold flex items-center gap-1">
              View all <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
          {recentQueries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No queries yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentQueries.map(q => (
                <div key={q.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm uppercase flex-shrink-0">{q.name?.[0]??'?'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{q.name}</p>
                    <p className="text-xs text-slate-400 truncate">{q.email||'—'} · {formatDate(q.createdAt)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_STYLE[q.status]??STATUS_STYLE.new}`}>{q.status??'new'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-6">
        <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            ['/admin/doctors',      '+ Add Doctor',     'bg-cyan-500 hover:bg-cyan-400 text-white'],
            ['/admin/appointments', '+ Add Appointment','bg-violet-500 hover:bg-violet-400 text-white'],
            ['/admin/testimonials', '+ Add Review',     'bg-amber-400 hover:bg-amber-300 text-white'],
            ['/admin/queries',      'View Queries',     'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'],
          ].map(([to,label,cls]) => (
            <Link key={to} to={to} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${cls}`}>{label}</Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
