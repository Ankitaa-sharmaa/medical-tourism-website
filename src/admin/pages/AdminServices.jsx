import { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaSpinner,
  FaCheckCircle, FaExclamationCircle, FaStethoscope,
} from 'react-icons/fa';

const CATEGORIES = ['Surgery', 'Dental', 'Eye', 'Wellness'];

const CATEGORY_BADGE = {
  Surgery: 'bg-rose-100 text-rose-700',
  Dental:  'bg-emerald-100 text-emerald-700',
  Eye:     'bg-blue-100 text-blue-700',
  Wellness:'bg-teal-100 text-teal-700',
};

// Default seed data so the admin can populate DB with one click
const SEED_SERVICES = [
  {
    title: 'Cardiology', category: 'Surgery', order: 1,
    desc: 'Comprehensive cardiac care including coronary bypass surgery, angioplasty, valve replacement, and heart transplants performed by internationally trained cardiologists.',
    features: ['Coronary Bypass Surgery', 'Angioplasty & Stenting', 'Valve Replacement', 'Heart Transplant'],
    from: '₹1,50,000', tag: 'Most Popular',
  },
  {
    title: 'Neurology & Brain Surgery', category: 'Surgery', order: 2,
    desc: 'Advanced neurological treatments performed by fellowship-trained neurosurgeons — from complex brain tumour removal to minimally invasive spine interventions.',
    features: ['Brain Tumour Surgery', 'Epilepsy Treatment', 'Spine Surgery', 'Stroke Rehabilitation'],
    from: '₹2,00,000', tag: '',
  },
  {
    title: 'Orthopedics', category: 'Surgery', order: 3,
    desc: 'Robotic-assisted joint replacements, complex spine surgeries, sports medicine, and ACL reconstructions at India\'s top orthopaedic centres.',
    features: ['Knee & Hip Replacement', 'Robotic Surgery', 'Spine Fusion', 'Sports Injuries'],
    from: '₹1,80,000', tag: '',
  },
  {
    title: 'Dental Care', category: 'Dental', order: 4,
    desc: 'Full-spectrum dental services from cosmetic veneers and dental implants to full-mouth reconstruction and Invisalign — all at a fraction of Western prices.',
    features: ['Dental Implants', 'Veneers & Crowns', 'Full-Mouth Rehab', 'Invisalign'],
    from: '₹15,000', tag: 'Great Value',
  },
  {
    title: 'General Surgery', category: 'Surgery', order: 5,
    desc: 'Minimally invasive laparoscopic procedures, weight-loss surgery, cancer resections, and hernia repairs by experienced surgeons.',
    features: ['Laparoscopic Surgery', 'Bariatric Surgery', 'Cancer Resection', 'Hernia Repair'],
    from: '₹80,000', tag: '',
  },
  {
    title: 'Eye Care', category: 'Eye', order: 6,
    desc: 'State-of-the-art ophthalmology treatments including LASIK laser correction, cataract removal, glaucoma management, and corneal transplants.',
    features: ['LASIK Correction', 'Cataract Surgery', 'Glaucoma Treatment', 'Corneal Transplant'],
    from: '₹25,000', tag: '',
  },
  {
    title: 'Preventive & Wellness', category: 'Wellness', order: 7,
    desc: 'Executive health check packages, full-body screening, cancer markers, cardiac risk assessment, and personalised wellness programs.',
    features: ['Full-Body Screening', 'Cancer Markers', 'Cardiac Risk Check', 'Wellness Programs'],
    from: '₹8,000', tag: 'Quick Turnaround',
  },
];

const EMPTY = { title: '', category: 'Surgery', desc: '', features: '', from: '', tag: '', available: true, order: 0 };

const AdminServices = () => {
  const [services,   setServices]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('all');
  const [modal,      setModal]      = useState(null); // 'add' | 'edit'
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [saving,     setSaving]     = useState(false);
  const [seeding,    setSeeding]    = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts,     setToasts]     = useState([]);

  const toast = useCallback((type, msg) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Open edit modal ────────────────────────────────────────────
  const openEdit = (s) => {
    setEditId(s._id);
    setForm({
      title:     s.title,
      category:  s.category,
      desc:      s.desc,
      features:  Array.isArray(s.features) ? s.features.join('\n') : '',
      from:      s.from  || '',
      tag:       s.tag   || '',
      available: s.available ?? true,
      order:     s.order ?? 0,
    });
    setModal('edit');
  };

  // ── Save (add or edit) ─────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      order:    Number(form.order) || 0,
    };
    try {
      if (modal === 'edit') {
        await api.put(`/services/${editId}`, payload);
        toast('success', `"${form.title}" updated.`);
      } else {
        await api.post('/services', payload);
        toast('success', `"${form.title}" added.`);
      }
      setModal(null);
      setForm(EMPTY);
      setEditId(null);
      await fetchServices();
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/services/${id}`);
      toast('success', `"${title}" deleted.`);
      setServices(p => p.filter(s => s._id !== id));
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Toggle availability ────────────────────────────────────────
  const toggleAvailable = async (s) => {
    try {
      const { data } = await api.put(`/services/${s._id}`, {
        title: s.title, category: s.category, desc: s.desc,
        features: s.features, from: s.from, tag: s.tag,
        available: !s.available, order: s.order,
      });
      setServices(p => p.map(x => x._id === s._id ? data : x));
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    }
  };

  // ── Seed default services ──────────────────────────────────────
  const seedServices = async () => {
    if (!window.confirm('Add 7 default services to MongoDB?')) return;
    setSeeding(true);
    try {
      await Promise.all(SEED_SERVICES.map(s => api.post('/services', s)));
      toast('success', '7 services seeded successfully.');
      await fetchServices();
    } catch (err) {
      toast('error', err.response?.data?.message || err.message);
    } finally {
      setSeeding(false);
    }
  };

  // ── Filtered view ──────────────────────────────────────────────
  const filtered = services.filter(s => {
    const matchSearch = [s.title, s.category, s.desc].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    );
    const matchCat = catFilter === 'all' || s.category === catFilter;
    return matchSearch && matchCat;
  });

  const TOAST_STYLE = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error:   'bg-red-50 border-red-200 text-red-800',
  };

  const closeModal = () => { setModal(null); setForm(EMPTY); setEditId(null); };

  return (
    <AdminLayout title="Services">

      {/* Toasts */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${TOAST_STYLE[t.type] || TOAST_STYLE.error}`}>
            {t.type === 'success'
              ? <FaCheckCircle className="flex-shrink-0 mt-0.5" />
              : <FaExclamationCircle className="flex-shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{t.msg}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
              className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 w-full sm:w-64 bg-white shadow-sm"
            />
          </div>
          <select
            value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-400 bg-white shadow-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          {services.length === 0 && !loading && (
            <button
              onClick={seedServices} disabled={seeding}
              className="flex items-center gap-2 bg-violet-500 hover:bg-violet-400 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-70"
            >
              {seeding ? <FaSpinner className="animate-spin" /> : '⚡'} Seed 7 Services
            </button>
          )}
          <button
            onClick={() => { setForm(EMPTY); setModal('add'); }}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm"
          >
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaStethoscope className="text-4xl mx-auto mb-3 opacity-20" />
            <p className="font-medium">{search ? `No results for "${search}"` : 'No services yet.'}</p>
            {services.length === 0 && (
              <p className="text-sm mt-2">Click "Seed 7 Services" to populate from the default list.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Title', 'Category', 'Starting From', 'Tag', 'Available', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{s.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{s.desc}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_BADGE[s.category] || 'bg-slate-100 text-slate-600'}`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium">{s.from || '—'}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{s.tag || '—'}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleAvailable(s)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${s.available ? 'bg-emerald-400' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${s.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)}
                          className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition">
                          <FaEdit className="text-sm" />
                        </button>
                        <button onClick={() => handleDelete(s._id, s.title)} disabled={deletingId === s._id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                          {deletingId === s._id
                            ? <FaSpinner className="text-sm animate-spin" />
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
        {!loading && services.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} of {services.length} services</p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> MongoDB
            </span>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <h2 className="text-xl font-black text-slate-900">
                {modal === 'edit' ? 'Edit Service' : 'New Service'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl">
                <FaTimes className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="px-7 py-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Title *</label>
                  <input
                    required value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Cardiology"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Category *</label>
                  <select
                    required value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white appearance-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Starting From</label>
                  <input
                    value={form.from}
                    onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                    placeholder="e.g. ₹1,50,000"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Description *</label>
                <textarea
                  required rows={3} value={form.desc}
                  onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                  placeholder="Describe the service…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white resize-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Features <span className="normal-case font-normal text-slate-400">(one per line)</span>
                </label>
                <textarea
                  rows={4} value={form.features}
                  onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                  placeholder={"Coronary Bypass Surgery\nAngioplasty & Stenting\nValve Replacement"}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white resize-none transition font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Badge / Tag</label>
                  <input
                    value={form.tag}
                    onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                    placeholder="e.g. Most Popular"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Display Order</label>
                  <input
                    type="number" min={0} value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 bg-white transition"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox" checked={form.available}
                  onChange={e => setForm(p => ({ ...p, available: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-500"
                />
                <span className="text-sm font-medium text-slate-700">Visible on website</span>
              </label>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 disabled:opacity-70">
                  {saving ? <><FaSpinner className="animate-spin" />Saving…</> : modal === 'edit' ? 'Save Changes' : '+ Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
