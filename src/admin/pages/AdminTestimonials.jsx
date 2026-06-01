import { useState, useCallback } from 'react';
import useLocalData from '../hooks/useLocalData';
import { MOCK_TESTIMONIALS } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaStar,
  FaQuoteLeft, FaCheckCircle, FaExclamationCircle, FaSpinner,
} from 'react-icons/fa';

const EMPTY = { name:'', title:'', avatar:'', rating: 5, text:'' };

const TOAST_CONFIG = {
  success: { bg:'bg-emerald-50 border-emerald-200', text:'text-emerald-800', icon:<FaCheckCircle className="text-emerald-500"/> },
  error:   { bg:'bg-red-50 border-red-200',         text:'text-red-800',     icon:<FaExclamationCircle className="text-red-500"/> },
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}
        className={`text-xl transition hover:scale-110 ${n <= value ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`}>
        <FaStar />
      </button>
    ))}
    <span className="ml-2 text-sm text-slate-500 font-medium self-center">{value}/5</span>
  </div>
);

const AdminTestimonials = () => {
  const { items, add, update, remove } = useLocalData('admin_testimonials', MOCK_TESTIMONIALS);

  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts,     setToasts]     = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal('form'); };
  const openEdit = (t) => {
    setForm({ name: t.name, title: t.title, avatar: t.avatar||'', rating: t.rating, text: t.text });
    setEditId(t.id);
    setModal('form');
  };
  const close = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const payload = { ...form, rating: Number(form.rating) };
      if (!editId) {
        add(payload);
        addToast('success', `Review by ${form.name} added!`);
      } else {
        update(editId, payload);
        addToast('success', `Review by ${form.name} updated!`);
      }
      close();
      setSaving(false);
    }, 350);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete review by ${name}?`)) return;
    setDeletingId(id);
    setTimeout(() => {
      remove(id);
      addToast('success', `Review by ${name} deleted.`);
      setDeletingId(null);
    }, 300);
  };

  return (
    <AdminLayout title="Testimonials">

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

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-500 text-sm">{items.length} review{items.length !== 1 ? 's' : ''} total</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm">
          <FaPlus /> Add Review
        </button>
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <div className="text-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FaQuoteLeft className="text-5xl mx-auto mb-3 opacity-20" />
          <p className="font-medium">No reviews yet.</p>
          <p className="text-sm mt-1">Click "Add Review" to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[1,2,3,4,5].map(n => (
                  <FaStar key={n} className={`text-sm ${n <= t.rating ? 'text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-4">"{t.text}"</p>
              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=e0f2fe&color=0369a1`}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=e0f2fe&color=0369a1`; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.title}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(t)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition">
                    <FaEdit className="text-xs" />
                  </button>
                  <button onClick={() => handleDelete(t.id, t.name)} disabled={deletingId === t.id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50">
                    {deletingId === t.id ? <FaSpinner className="text-xs animate-spin" /> : <FaTrash className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modal === 'form' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">{editId ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={close} className="p-2 hover:bg-slate-100 rounded-xl"><FaTimes className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSave} className="px-7 py-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {[['Patient Name *','name','text','Sophia Miller',true],['Title / Origin','title','text','Cardiac Patient · USA',false]].map(([label,key,type,ph,req]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
                    <input required={req} type={type} value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Avatar URL</label>
                <div className="flex gap-3 items-center">
                  <input type="url" value={form.avatar} onChange={e => setForm(p=>({...p,avatar:e.target.value}))} placeholder="https://randomuser.me/api/portraits/…"
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition" />
                  <div className="w-11 h-11 rounded-full border-2 border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100">
                    {form.avatar
                      ? <img src={form.avatar} alt="" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none';}} />
                      : <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg">?</div>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Rating *</label>
                <StarPicker value={form.rating} onChange={v => setForm(p=>({...p,rating:v}))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Review Text *</label>
                <textarea required rows={4} value={form.text} onChange={e => setForm(p=>({...p,text:e.target.value}))} placeholder="Share the patient's experience…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white resize-none transition" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={close} className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-70">
                  {saving ? <><FaSpinner className="animate-spin" />Saving…</> : editId ? '✓ Save Changes' : '+ Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTestimonials;
