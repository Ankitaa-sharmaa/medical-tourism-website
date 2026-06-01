import { useState, useCallback } from 'react';
import useLocalData from '../hooks/useLocalData';
import { MOCK_QUERIES } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import {
  FaSearch, FaEnvelope, FaCheckCircle, FaTrash,
  FaTimes, FaEye, FaSpinner, FaExclamationCircle,
} from 'react-icons/fa';

const STATUS_STYLE = {
  new:      'bg-sky-100 text-sky-700 border border-sky-200',
  resolved: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const TOAST_CONFIG = {
  success: { bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-800', icon:<FaCheckCircle className="text-emerald-500"/> },
  error:   { bg:'bg-red-50 border-red-200',         text:'text-red-800',     icon:<FaExclamationCircle className="text-red-500"/> },
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
};

const AdminQueries = () => {
  const { items: queries, update, remove } = useLocalData('admin_queries', MOCK_QUERIES);

  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all');
  const [selected,   setSelected]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts,     setToasts]     = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  const markResolved = (id) => {
    update(id, { status: 'resolved' });
    addToast('success', 'Query marked as resolved.');
    if (selected?.id === id) setSelected(p => ({ ...p, status: 'resolved' }));
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete query from ${name}?`)) return;
    setDeletingId(id);
    setTimeout(() => {
      remove(id);
      addToast('success', `Query from ${name} deleted.`);
      setDeletingId(null);
      if (selected?.id === id) setSelected(null);
    }, 300);
  };

  const counts = {
    all:      queries.length,
    new:      queries.filter(q => !q.status || q.status === 'new').length,
    resolved: queries.filter(q => q.status === 'resolved').length,
  };

  const filtered = queries.filter(q => {
    const matchSearch = [q.name, q.email, q.service].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || q.status === filter || (!q.status && filter === 'new');
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Contact Queries">

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
        <p className="text-sm text-slate-400">{counts.new} unresolved</p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[['all','All'],['new','New'],['resolved','Resolved']].map(([key,label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filter===key?'bg-cyan-500 text-white shadow-sm':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter===key?'bg-white/20':'bg-slate-100 text-slate-500'}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaEnvelope className="text-4xl mx-auto mb-3 opacity-20" />
            <p className="font-medium">No queries found.</p>
            <p className="text-sm mt-1">Contact form submissions appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Sender','Service','Date','Status','Actions'].map(h => (
                    <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h==='Date'?'hidden lg:table-cell':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q.id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i%2===1?'bg-slate-50/30':''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{q.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{q.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">{q.service || '—'}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{formatDate(q.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[q.status]??STATUS_STYLE.new}`}>
                        {q.status ?? 'new'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" onClick={() => setSelected(q)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition"><FaEye className="text-sm" /></button>
                        {(!q.status || q.status === 'new') && (
                          <button title="Mark resolved" onClick={() => markResolved(q.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"><FaCheckCircle className="text-sm" /></button>
                        )}
                        <button title="Delete" onClick={() => handleDelete(q.id, q.name)} disabled={deletingId===q.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                          {deletingId===q.id ? <FaSpinner className="text-sm animate-spin" /> : <FaTrash className="text-sm" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {queries.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">{filtered.length} of {queries.length} queries shown</p>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Query Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500" /></button>
            </div>
            <div className="px-7 py-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg uppercase">
                  {selected.name?.[0] ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{selected.name}</p>
                  <p className="text-slate-500 text-sm">{selected.email}</p>
                </div>
              </div>

              {[['Phone', selected.phone||'—'], ['Country', selected.country||'—'], ['Service', selected.service||'—'], ['Date', formatDate(selected.createdAt)]].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 w-16 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 text-right">{value}</span>
                </div>
              ))}

              {selected.message && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 leading-relaxed border border-slate-200">
                    {selected.message}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_STYLE[selected.status]??STATUS_STYLE.new}`}>
                  {selected.status ?? 'new'}
                </span>
                <div className="flex gap-2">
                  {(!selected.status || selected.status === 'new') && (
                    <button onClick={() => markResolved(selected.id)} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition">
                      Mark Resolved
                    </button>
                  )}
                  <button onClick={() => handleDelete(selected.id, selected.name)} className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminQueries;
