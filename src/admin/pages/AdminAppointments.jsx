import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaSearch, FaCalendarAlt, FaCheckCircle,
  FaCheck, FaTrash, FaTimes, FaEye, FaSpinner, FaExclamationCircle,
} from 'react-icons/fa';

const SERVICES  = ['Cardiology','Neurology','Orthopedics','Dental Care','Eye Care','General Surgery','Oncology','Wellness','Other'];
const COUNTRIES = ['United States','United Kingdom','UAE','Canada','Australia','Germany','France','Saudi Arabia','Bangladesh','Nigeria','Kenya','Other'];

const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  completed: 'bg-blue-100 text-blue-700 border border-blue-200',
};

const EMPTY = { fullName:'', email:'', phone:'', country:'', service:'', preferredDate:'', message:'' };

const formatDate = iso => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
};

const AdminAppointments = () => {
  const [appts,        setAppts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal,        setModal]        = useState(null);
  const [selected,     setSelected]     = useState(null);
  const [form,         setForm]         = useState(EMPTY);
  const [saving,       setSaving]       = useState(false);
  const [deletingId,   setDeletingId]   = useState(null);
  const [toasts,       setToasts]       = useState([]);

  const toast = useCallback((type, msg) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const fetchAppts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments');
      setAppts(data);
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchAppts(); }, [fetchAppts]);

  const handleAdd = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/appointments', form);
      toast('success', `Appointment for ${form.fullName} added.`);
      setModal(null); setForm(EMPTY);
      await fetchAppts();
    } catch (err) { toast('error', err.response?.data?.message || err.message); }
    finally { setSaving(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/appointments/${id}`, { status });
      setAppts(p => p.map(a => a._id === id ? data : a));
      toast('success', `Marked as ${status}.`);
      if (selected?._id === id) setSelected(data);
    } catch (err) { toast('error', err.response?.data?.message || err.message); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete appointment for ${name}?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      toast('success', 'Deleted.');
      setAppts(p => p.filter(a => a._id !== id));
      if (modal === 'view') setModal(null);
    } catch (err) { toast('error', err.response?.data?.message || err.message); }
    finally { setDeletingId(null); }
  };

  const counts = {
    all:       appts.length,
    pending:   appts.filter(a => a.status === 'pending').length,
    confirmed: appts.filter(a => a.status === 'confirmed').length,
    completed: appts.filter(a => a.status === 'completed').length,
  };

  const filtered = appts.filter(a => {
    const s  = [a.fullName, a.email, a.service].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const st = statusFilter === 'all' || a.status === statusFilter;
    return s && st;
  });

  const TOAST_STYLE = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <AdminLayout title="Appointments">
      {/* Toasts */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${TOAST_STYLE[t.type]||TOAST_STYLE.error}`}>
            {t.type==='success'?<FaCheckCircle className="flex-shrink-0 mt-0.5"/>:<FaExclamationCircle className="flex-shrink-0 mt-0.5"/>}
            <p className="text-sm font-medium">{t.msg}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, service…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 w-full sm:w-72 bg-white shadow-sm"/>
        </div>
        <button onClick={()=>{setForm(EMPTY);setModal('add');}}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm">
          <FaPlus/> Add Appointment
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[['all','All'],['pending','Pending'],['confirmed','Confirmed'],['completed','Completed']].map(([key,label])=>(
          <button key={key} onClick={()=>setStatusFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${statusFilter===key?'bg-cyan-500 text-white shadow-sm':'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${statusFilter===key?'bg-white/20':'bg-slate-100 text-slate-500'}`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"/></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaCalendarAlt className="text-4xl mx-auto mb-3 opacity-20"/>
            <p className="font-medium">{search?`No results for "${search}"`:'No appointments yet.'}</p>
            <p className="text-sm mt-1">Appointments appear here when users submit the consultation form.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Patient','Service','Preferred Date','Country','Status','Actions'].map(h=>(
                  <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h==='Country'?'hidden md:table-cell':''} ${h==='Preferred Date'?'hidden lg:table-cell':''}`}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((a,i)=>(
                  <tr key={a._id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i%2===1?'bg-slate-50/30':''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{a.fullName}</p>
                      <p className="text-xs text-slate-400">{a.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{a.service||'—'}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell">
                      {a.preferredDate ? (
                        <span className="bg-cyan-50 text-cyan-700 border border-cyan-100 px-2 py-1 rounded-lg">{a.preferredDate}</span>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs hidden md:table-cell">{a.country||'—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[a.status]??STATUS_STYLE.pending}`}>{a.status??'pending'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={()=>{setSelected(a);setModal('view');}} title="View" className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition"><FaEye className="text-sm"/></button>
                        {a.status!=='confirmed'&&a.status!=='completed'&&(
                          <button onClick={()=>updateStatus(a._id,'confirmed')} title="Confirm" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition"><FaCheckCircle className="text-sm"/></button>
                        )}
                        {a.status==='confirmed'&&(
                          <button onClick={()=>updateStatus(a._id,'completed')} title="Mark Complete" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"><FaCheck className="text-sm"/></button>
                        )}
                        <button onClick={()=>handleDelete(a._id,a.fullName)} disabled={deletingId===a._id} title="Delete" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                          {deletingId===a._id?<FaSpinner className="text-sm animate-spin"/>:<FaTrash className="text-sm"/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && appts.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} of {appts.length} appointments</p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"/>MongoDB
            </span>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      {modal==='add' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">New Appointment</h2>
              <button onClick={()=>setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500"/></button>
            </div>
            <form onSubmit={handleAdd} className="px-7 py-6 space-y-4">
              {[['Full Name *','fullName','text','John Smith',true],['Email *','email','email','john@email.com',true],['Phone','phone','tel','+1 555 000 0000',false]].map(([lb,k,type,ph,req])=>(
                <div key={k}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{lb}</label>
                  <input type={type} required={req} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={ph}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[['Country','country',COUNTRIES],['Service','service',SERVICES]].map(([lb,k,opts])=>(
                  <div key={k}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{lb}</label>
                    <select value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white appearance-none">
                      <option value="">Select</option>
                      {opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Preferred Date</label>
                <input type="date" value={form.preferredDate} onChange={e=>setForm(p=>({...p,preferredDate:e.target.value}))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white transition"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Message / Notes</label>
                <textarea rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Patient's message or additional notes…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white resize-none transition"/>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={()=>setModal(null)} className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-70">
                  {saving?<><FaSpinner className="animate-spin"/>Saving…</>:'+ Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Modal ── */}
      {modal==='view' && selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">Appointment Details</h2>
              <button onClick={()=>setModal(null)} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500"/></button>
            </div>
            <div className="px-7 py-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg uppercase">{(selected.fullName||'?')[0].toUpperCase()}</div>
                <div><p className="font-bold text-slate-900 text-lg">{selected.fullName}</p><p className="text-slate-500 text-sm">{selected.email}</p></div>
              </div>
              {[
                ['Phone',     selected.phone        || '—'],
                ['Country',   selected.country      || '—'],
                ['Service',   selected.service      || '—'],
                ['Preferred', selected.preferredDate|| '—'],
                ['Submitted', formatDate(selected.createdAt)],
                ['Message',   selected.message      || '—'],
              ].map(([lb,val])=>(
                <div key={lb} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5 w-20 flex-shrink-0">{lb}</span>
                  <span className="text-sm text-slate-700 text-right">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_STYLE[selected.status]??STATUS_STYLE.pending}`}>{selected.status??'pending'}</span>
                <div className="flex gap-2">
                  {selected.status==='pending'&&(
                    <button onClick={()=>updateStatus(selected._id,'confirmed')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition">Confirm</button>
                  )}
                  {selected.status==='confirmed'&&(
                    <button onClick={()=>updateStatus(selected._id,'completed')} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-bold transition">Complete</button>
                  )}
                  <button onClick={()=>handleDelete(selected._id,selected.fullName)} className="px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-bold transition">Delete</button>
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
