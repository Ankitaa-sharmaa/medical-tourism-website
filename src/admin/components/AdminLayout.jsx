import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaChartBar,
  FaUserMd,
  FaCalendarAlt,
  FaStethoscope,
  FaStar,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHospital,
} from 'react-icons/fa';

const NAV = [
  { to: '/admin/dashboard',    icon: <FaChartBar />,     label: 'Dashboard'     },
  { to: '/admin/doctors',      icon: <FaUserMd />,       label: 'Doctors'       },
  { to: '/admin/appointments', icon: <FaCalendarAlt />,  label: 'Appointments'  },
  { to: '/admin/services',     icon: <FaStethoscope />,  label: 'Services'      },
  { to: '/admin/testimonials', icon: <FaStar />,         label: 'Testimonials'  },
  { to: '/admin/queries',      icon: <FaEnvelope />,     label: 'Queries'       },
];

const AdminLayout = ({ children, title }) => {
  const { user, logOut }   = useAuth();
  const navigate           = useNavigate();
  const [open, setOpen]    = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
        <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center">
          <FaHospital className="text-white text-sm" />
        </div>
        <div>
          <p className="font-black text-slate-900 text-base leading-none">MedTour</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500 pl-3'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-xs uppercase">
            {user?.email?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Admin</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium transition"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col lg:hidden transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                onClick={() => setOpen(!open)}
              >
                {open ? <FaTimes /> : <FaBars />}
              </button>
              <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Live
              </div>
              <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold text-sm uppercase">
                {user?.email?.[0] ?? 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
