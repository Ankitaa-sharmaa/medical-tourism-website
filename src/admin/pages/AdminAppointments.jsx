import { useState, useCallback } from 'react';
import useLocalData from '../hooks/useLocalData';
import { MOCK_APPOINTMENTS } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaSearch, FaCalendarAlt, FaCheckCircle, FaBan,
  FaTrash, FaTimes, FaEye, FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';

const SERVICES  = ['Cardiology','Neurology','Orthopedics','Dental Care','Eye Care','General Surgery','Oncology','Wellness','Other'];
const COUNTRIES = ['United States','United Kingdom','UAE','Canada','Australia','Germany','France','Saudi Arabia','Bangladesh','Nigeria','Kenya','Other'];

const STATUS_STYLE = {
  pending:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  rejected: 'bg-red-100 text-red-600 border border-red-200',
};

const TOAST_CONFIG = {
  success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: <FaCheckCircle className="text-emerald-500" /> },
  error:   { bg: 'bg-red-50 border-red-200',         text: 'text-red-800',     icon: <FaExclamationCircle className="text-red-500" /> },
};

const EMPTY = { name:'', email:'', phone:'', country:'', service:'', notes:'' };

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};

const AdminAppointments = () => {
  const { items: appts, add, update, remove } = useLocalData('admin_appointments', MOCK_APPOINTMENTS);

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal,        setModal]        = useState(null);  // 'add' | 'view'
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState(EMPTY);
  const [saving,       setSaving]       = useState(false);
  const [deletingId,   setDeletingId]   = useState(null);
  const [toasts,       setToasts]       = useState([]);

  // ── Toasts ──
  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  // ── CRUD ──
  const handleAdd = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      add({ ...form, status: 'pending' });
      addToast('success', `Appointment for ${form.name} added.`);
      setModal(null);
      setForm(EMPTY);
      setSaving(false);
    }, 350);
  };

  const updateStatus = (id, status) => {
    update(id, { status });
    addToast('success', `Appointment marked as ${status}.`);
    if (selected?.id === id) setSelected(p => ({ ...p, status }));
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete appointment for ${name}?`)) return;
    setDeletingId(id);
    setTimeout(() => {
      remove(id);
      addToast('success', `Appointment for ${name} deleted.`);
      setDeletingId(null);
      if (modal === 'view') setModal(null);
    }, 300);
  };

  // ── Counts ──
  const counts = {
    all:      appts.length,
    pending:  appts.filter(a => a.status === 'pending').length,
    approved: appts.filter(a => a.status === 'approved').length,
    rejected: appts.filter(a => a.status === 'rejected').length,
  };

  // ── Filtered ──
  const filtered = appts.filter(a => {
    const matchSearch = [a.name, a.email, a.service].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout title="Appointments">

      {/* Toasts */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(t => {
          const c = TOAST_CONFIG[t.type];
          return (
            <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${c.bg}`}>
              <span className="text-base mt-0.5 flex-shrink-0">{c.icon}</span>
              <p className={`text-sm font-medium ${c.text}`}>{t.message}</p>
            </div>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, service…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 w-full sm:w-72 bg-white shadow-sm" />
        </div>
        <button onClick={() => { setForm(EMPTY); setModal('add'); }}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm">
          <FaPlus /> Add Appointment
        </button>
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[['all','All'],['pending','Pending'],['approved','Approved'],['rejected','Rejected']].map(([key,label]) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${statusFilter === key ? 'bg-cyan-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaCalendarAlt className="text-4xl mx-auto mb-3 opacity-20" />
            <p className="font-medium">No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Patient','Service','Country','Date','Status','Actions'].map(h => (
                    <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h==='Country'?'hidden md:table-cell':''} ${h==='Date'?'hidden lg:table-cell':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i%2===1?'bg-slate-50/30':''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-400">{a.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-sm">{a.service || '—'}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">{a.country || '—'}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{formatDate(a.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[a.status]??STATUS_STYLE.pending}`}>
                        {a.status ?? 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" onClick={() => { setSelected(a); setModal('view'); }} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition"><FaEye className="text-sm" /></button>
                        {a.status !== 'approved' && <button title="Approve" onClick={() => updateStatus(a.id,'approved')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"><FaCheckCircle className="text-sm" /></button>}
                        {a.status !== 'rejected' && <button title="Reject"  onClick={() => updateStatus(a.id,'rejected')} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"><FaBan className="text-sm" /></button>}
                        <button title="Delete" onClick={() => handleDelete(a.id, a.name)} disabled={deletingId===a.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                          {deletingId===a.id ? <FaSpinner className="text-sm animate-spin" /> : <FaTrash className="text-sm" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {appts.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">{filtered.length} of {appts.length} appointments</p>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      {modal === 'add' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">New Appointment</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleAdd} className="px-7 py-6 space-y-4">
              {[['Full Name *','name','text','John Smith',true],['Email *','email','email','john@email.com',true],['Phone','phone','tel','+1 555 000 0000',false]].map(([label,key,type,ph,req]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
                  <input type={type} required={req} value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[['Country','country',COUNTRIES],['Service','service',SERVICES]].map(([label,key,opts]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
                    <select value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white appearance-none">
                      <option value="">Select</option>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Notes</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} placeholder="Additional notes…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white resize-none transition" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-70">
                  {saving ? <><FaSpinner className="animate-spin" />Saving…</> : '+ Add Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Appointment Details</h2>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500" /></button>
            </div>
            <div className="px-7 py-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg uppercase">
                  {selected.name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{selected.name}</p>
                  <p className="text-slate-500 text-sm">{selected.email}</p>
                </div>
              </div>
              {[['Phone', selected.phone||'—'], ['Country', selected.country||'—'], ['Service', selected.service||'—'], ['Date', formatDate(selected.createdAt)], ['Notes', selected.notes||'—']].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 w-16 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 text-right">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_STYLE[selected.status]??STATUS_STYLE.pending}`}>
                  {selected.status ?? 'pending'}
                </span>
                <div className="flex gap-2">
                  {selected.status !== 'approved' && <button onClick={() => updateStatus(selected.id,'approved')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition">Approve</button>}
                  {selected.status !== 'rejected' && <button onClick={() => updateStatus(selected.id,'rejected')} className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl text-xs font-bold transition">Reject</button>}
                  <button onClick={() => handleDelete(selected.id, selected.name)} className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAppointments;
