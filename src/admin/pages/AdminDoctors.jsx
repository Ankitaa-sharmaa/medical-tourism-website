import { useState, useCallback } from 'react';
import useLocalData from '../hooks/useLocalData';
import { MOCK_DOCTORS } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaUserMd,
  FaTimes, FaStar, FaCheckCircle, FaExclamationCircle,
  FaInfoCircle, FaSpinner,
} from 'react-icons/fa';

// ─── Constants ────────────────────────────────────────────────
const SPECIALTIES = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Dental',
  'Surgery', 'Oncology', 'Eye Care', 'Wellness',
];
const EMPTY_FORM = {
  name: '', role: '', specialty: '', exp: '', hospital: '',
  rating: 4.5, bio: '', image: '', langs: '', available: true,
};

// ─── Toast ────────────────────────────────────────────────────
const TOAST_CONFIG = {
  success: { icon: <FaCheckCircle />,      bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', ic: 'text-emerald-500' },
  error:   { icon: <FaExclamationCircle />, bg: 'bg-red-50 border-red-200',         text: 'text-red-800',     ic: 'text-red-500'     },
  info:    { icon: <FaInfoCircle />,        bg: 'bg-cyan-50 border-cyan-200',        text: 'text-cyan-800',    ic: 'text-cyan-500'    },
};
const ToastContainer = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
    {toasts.map(t => {
      const c = TOAST_CONFIG[t.type];
      return (
        <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${c.bg}`}>
          <span className={`${c.ic} text-base mt-0.5 flex-shrink-0`}>{c.icon}</span>
          <p className={`text-sm font-medium leading-snug ${c.text}`}>{t.message}</p>
        </div>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const AdminDoctors = () => {
  const { items: doctors, add, update, remove } = useLocalData('admin_doctors', MOCK_DOCTORS);

  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);  // 'add' | 'edit'
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts,     setToasts]     = useState([]);

  // ── Toasts ────────────────────────────────────────────────
  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  const toast = {
    success: m => addToast('success', m),
    error:   m => addToast('error', m),
  };

  // ── Modal helpers ─────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal('add'); };
  const openEdit = (d) => {
    setForm({ name: d.name, role: d.role, specialty: d.specialty, exp: d.exp,
              hospital: d.hospital, rating: d.rating ?? 4.5, bio: d.bio || '',
              image: d.image || '', langs: d.langs || '', available: d.available ?? true });
    setEditId(d.id);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null); };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate brief async save
    setTimeout(() => {
      const payload = {
        ...form,
        rating: parseFloat(form.rating) || 4.5,
        name: form.name.trim(),
        role: form.role.trim(),
        hospital: form.hospital.trim(),
        bio: form.bio.trim(),
        image: form.image.trim(),
        langs: form.langs.trim(),
      };

      try {
        if (modal === 'add') {
          add(payload);
          toast.success(`Dr. ${payload.name} added successfully!`);
        } else {
          update(editId, payload);
          toast.success(`Dr. ${payload.name} updated successfully!`);
        }
        closeModal();
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    setTimeout(() => {
      remove(id);
      toast.success(`${name} removed successfully.`);
      setDeletingId(null);
    }, 300);
  };

  // ── Filtered ──────────────────────────────────────────────
  const filtered = doctors.filter(d =>
    [d.name, d.specialty, d.hospital, d.role]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // ──────────────────────────────── RENDER ────────────────────
  return (
    <AdminLayout title="Doctors Management">
      <ToastContainer toasts={toasts} />

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, specialty, hospital…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 w-full sm:w-72 bg-white shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''}
            {search ? ` for "${search}"` : ''}
          </span>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
          >
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserMd className="text-slate-400 text-2xl" />
            </div>
            <p className="font-semibold text-slate-700 text-lg">
              {search ? 'No results found' : 'No doctors yet'}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {search ? `No doctors match "${search}".` : 'Click "Add Doctor" to add your first doctor.'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 text-cyan-600 text-sm font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Doctor', 'Specialty', 'Hospital', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h === 'Hospital' ? 'hidden lg:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={d.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name || 'D')}&background=e0f2fe&color=0369a1&size=80`}
                            alt={d.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name || 'D')}&background=e0f2fe&color=0369a1`; }}
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${d.available ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{d.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{d.role}</p>
                        </div>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-xs font-semibold">
                        {d.specialty}
                      </span>
                    </td>

                    {/* Hospital */}
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell max-w-[180px] truncate">
                      {d.hospital}
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <FaStar className="text-amber-400 text-xs" />
                        {Number(d.rating || 0).toFixed(1)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        d.available
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-600 border border-red-200'
                      }`}>
                        {d.available ? '● Available' : '● Unavailable'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(d)}
                          className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition"
                          title="Edit"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          disabled={deletingId === d.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === d.id
                            ? <FaSpinner className="text-sm text-red-400 animate-spin" />
                            : <FaTrash className="text-sm" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {doctors.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {filtered.length} of {doctors.length} doctors shown
            </p>
            <span className="text-xs text-slate-400 font-medium">Saved locally · no database needed</span>
          </div>
        )}
      </div>

      {/* ══════════════════ ADD / EDIT MODAL ══════════════════ */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 border border-slate-200">

            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {modal === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  {modal === 'add' ? 'Saved to localStorage — no database needed' : `Editing: ${form.name}`}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="px-7 py-6 space-y-5">

              {/* Name + Role */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <input required value={form.name} onChange={e => f('name', e.target.value)} placeholder="Dr. Jane Smith"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                  <input required value={form.role} onChange={e => f('role', e.target.value)} placeholder="Senior Cardiologist"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition" />
                </div>
              </div>

              {/* Specialty + Experience */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Specialty *</label>
                  <select required value={form.specialty} onChange={e => f('specialty', e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 transition appearance-none cursor-pointer">
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Experience *</label>
                  <input required value={form.exp} onChange={e => f('exp', e.target.value)} placeholder="15 Yrs"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition" />
                </div>
              </div>

              {/* Hospital + Rating */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hospital *</label>
                  <input required value={form.hospital} onChange={e => f('hospital', e.target.value)} placeholder="Apollo Hospital, Mumbai"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Rating — <span className="text-amber-500 font-bold">{Number(form.rating).toFixed(1)} ★</span>
                  </label>
                  <input type="range" min="1" max="5" step="0.1" value={form.rating} onChange={e => f('rating', e.target.value)}
                    className="w-full accent-cyan-500 mt-3 cursor-pointer" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1.0</span><span>3.0</span><span>5.0</span>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Languages Spoken</label>
                <input value={form.langs} onChange={e => f('langs', e.target.value)} placeholder="English, Hindi, French"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition" />
              </div>

              {/* Image URL with live preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Profile Photo URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    value={form.image}
                    onChange={e => f('image', e.target.value)}
                    placeholder="https://example.com/doctor-photo.jpg"
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"
                  />
                  {/* Live avatar preview */}
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                    {form.image ? (
                      <img src={form.image} alt="preview" className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <FaUserMd className="text-slate-300 text-lg" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Paste any publicly accessible image URL. Preview updates as you type.
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bio / Description</label>
                <textarea rows={3} value={form.bio} onChange={e => f('bio', e.target.value)}
                  placeholder="Fellowship-trained at… Specialist in…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 resize-none transition" />
              </div>

              {/* Availability toggle */}
              <div
                onClick={() => f('available', !form.available)}
                className="flex items-center gap-4 cursor-pointer select-none p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition"
              >
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form.available ? 'bg-cyan-500' : 'bg-slate-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.available ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {form.available ? '✓ Available for appointments' : 'Currently unavailable'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Shown as a status badge on the doctors page</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} disabled={saving}
                  className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 min-w-[130px] justify-center">
                  {saving
                    ? <><FaSpinner className="animate-spin" /> Saving…</>
                    : modal === 'add' ? '+ Add Doctor' : '✓ Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDoctors;
