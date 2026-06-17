import { useState, useEffect, useCallback, useRef } from 'react';
import api, { mediaUrl } from '../../api';
import { MOCK_DOCTORS } from '../data/mockData';
import AdminLayout from '../components/AdminLayout';
import {
  FaPlus, FaEdit, FaTrash, FaSearch, FaUserMd, FaTimes,
  FaStar, FaCheckCircle, FaExclamationCircle,
  FaInfoCircle, FaSpinner, FaImage,
} from 'react-icons/fa';

// ─── Constants ────────────────────────────────────────────────
const SPECIALTIES = [
  'Cardiology','Neurology','Orthopedics','Dental',
  'Surgery','Oncology','Eye Care','Wellness',
];
const EMPTY = {
  name:'', role:'', specialty:'', exp:'', hospital:'',
  rating: 4.5, bio:'', image:'', langs:'', available: true,
};

// ─── Toast ────────────────────────────────────────────────────
const T = {
  success: { bg:'bg-emerald-50 border-emerald-200', tx:'text-emerald-800', ic:<FaCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5 text-base" /> },
  error:   { bg:'bg-red-50 border-red-200',         tx:'text-red-800',     ic:<FaExclamationCircle className="text-red-500 flex-shrink-0 mt-0.5 text-base" /> },
  info:    { bg:'bg-cyan-50 border-cyan-200',        tx:'text-cyan-800',    ic:<FaInfoCircle className="text-cyan-500 flex-shrink-0 mt-0.5 text-base" /> },
};
const Toasts = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg ${T[t.type].bg}`}>
        {T[t.type].ic}
        <p className={`text-sm font-medium leading-snug ${T[t.type].tx}`}>{t.msg}</p>
      </div>
    ))}
  </div>
);

// ─── Skeleton row ─────────────────────────────────────────────
const Sk = () => (
  <tr className="border-b border-slate-100 animate-pulse">
    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0"/><div className="space-y-1.5"><div className="h-3.5 w-28 bg-slate-200 rounded"/><div className="h-2.5 w-20 bg-slate-100 rounded"/></div></div></td>
    <td className="px-5 py-4"><div className="h-6 w-20 bg-slate-200 rounded-lg"/></td>
    <td className="px-5 py-4 hidden lg:table-cell"><div className="h-3 w-36 bg-slate-100 rounded"/></td>
    <td className="px-5 py-4"><div className="h-3 w-10 bg-slate-200 rounded"/></td>
    <td className="px-5 py-4"><div className="h-6 w-22 bg-slate-100 rounded-full"/></td>
    <td className="px-5 py-4"><div className="h-7 w-16 bg-slate-100 rounded-lg ml-auto"/></td>
  </tr>
);

// ─── Image Upload Zone ────────────────────────────────────────
const ImageZone = ({ preview, onFile, onUrl, urlVal, progress, uploading }) => {
  const inp = useRef();
  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Photo</label>

      {/* Drop zone */}
      <div
        onClick={() => inp.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all
          ${uploading ? 'border-cyan-400 bg-cyan-50' : 'border-slate-300 hover:border-cyan-400 hover:bg-slate-50'}`}
      >
        {preview ? (
          <div className="flex items-center gap-4">
            <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700">Photo ready</p>
              <p className="text-xs text-slate-400 mt-0.5">Click to change</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <FaImage className="text-slate-400 text-lg" />
            </div>
            <p className="text-sm font-semibold text-slate-600">Click to upload photo</p>
            <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 2 MB</p>
          </div>
        )}

        {/* Upload overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2">
            <FaSpinner className="text-cyan-500 text-xl animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Uploading… {Math.round(progress)}%</p>
            <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
        <input ref={inp} type="file" accept="image/*" hidden onChange={e => onFile(e.target.files[0])} />
      </div>

      {/* URL fallback */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">or paste URL</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      <input
        type="url" value={urlVal} onChange={e => onUrl(e.target.value)}
        placeholder="https://example.com/photo.jpg"
        className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"
      />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
const AdminDoctors = () => {
  const [doctors,    setDoctors]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts,     setToasts]     = useState([]);
  // image
  const [imgFile,    setImgFile]    = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [imgProg,    setImgProg]    = useState(0);
  const [uploading,  setUploading]  = useState(false);

  // ── Toasts ────────────────────────────────────────────────
  const toast = useCallback((type, msg) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  // ── Fetch from API ────────────────────────────────────────
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doctors');
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      toast('error', 'Could not load doctors: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  // ── Modal ─────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY); setEditId(null); setImgFile(null); setImgPreview(''); setModal('add'); };
  const openEdit = d => {
    setForm({ name:d.name, role:d.role, specialty:d.specialty, exp:d.exp, hospital:d.hospital,
              rating:d.rating??4.5, bio:d.bio||'', image:d.image||'', langs:d.langs||'', available:d.available??true });
    setEditId(d._id); setImgFile(null); setImgPreview(mediaUrl(d.image)||''); setModal('edit');
  };
  const close = () => { setModal(null); setForm(EMPTY); setEditId(null); setImgFile(null); setImgPreview(''); };

  // ── File select ───────────────────────────────────────────
  const handleFile = file => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('error', 'Image is too large (max 2 MB).'); return; }
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    setForm(p => ({ ...p, image: '' }));
  };

  // ── Upload to backend via multer ──────────────────────────
  const uploadImage = async file => {
    setUploading(true); setImgProg(0);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/doctors/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setImgProg(Math.round((e.loaded / e.total) * 100)),
      });
      return data.url; // e.g. /uploads/1234567-filename.jpg
    } finally {
      setUploading(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imgFile) {
        toast('info', 'Uploading photo…');
        imageUrl = await uploadImage(imgFile);
        toast('success', 'Photo uploaded!');
      }
      const payload = {
        name:      form.name.trim(),
        role:      form.role.trim(),
        specialty: form.specialty,
        exp:       form.exp.trim(),
        hospital:  form.hospital.trim(),
        rating:    parseFloat(form.rating) || 4.5,
        bio:       form.bio.trim(),
        image:     imageUrl,
        langs:     form.langs.trim(),
        available: form.available,
      };
      if (modal === 'add') {
        await api.post('/doctors', payload);
        toast('success', `Dr. ${payload.name} added successfully!`);
      } else {
        await api.put(`/doctors/${editId}`, payload);
        toast('success', `Dr. ${payload.name} updated!`);
      }
      close();
      await fetchDoctors();
    } catch (err) {
      toast('error', 'Save failed: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/doctors/${id}`);
      toast('success', `${name} removed.`);
      setDoctors(p => p.filter(d => d._id !== id));
    } catch (err) { toast('error', 'Delete failed: ' + (err.response?.data?.message || err.message)); }
    finally { setDeletingId(null); }
  };

  // ── Seed demo data ────────────────────────────────────────
  const [seeding, setSeeding] = useState(false);
  const seedDoctors = async () => {
    setSeeding(true);
    try {
      await Promise.all(
        MOCK_DOCTORS.map(({ id: _id, createdAt: _c, ...d }) => api.post('/doctors', d))
      );
      toast('success', `${MOCK_DOCTORS.length} demo doctors added!`);
      await fetchDoctors();
    } catch (err) {
      toast('error', 'Seeding failed: ' + (err.response?.data?.message || err.message));
    } finally { setSeeding(false); }
  };

  const filtered = doctors.filter(d =>
    [d.name, d.specialty, d.hospital, d.role].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );
  const f = (k,v) => setForm(p => ({ ...p, [k]: v }));

  // ─────────────────────────── RENDER ──────────────────────
  return (
    <AdminLayout title="Doctors Management">
      <Toasts toasts={toasts} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, specialty, hospital…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-cyan-400 w-full sm:w-72 bg-white shadow-sm" />
        </div>
        <div className="flex items-center gap-3">
          {!loading && <span className="text-xs text-slate-400 hidden sm:block">{filtered.length} doctor{filtered.length!==1?'s':''}</span>}
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm">
            <FaPlus /> Add Doctor
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{['Doctor','Specialty','Hospital','Rating','Status','Actions'].map(h=>(
                <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h==='Hospital'?'hidden lg:table-cell':''}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>{[1,2,3,4].map(i=><Sk key={i}/>)}</tbody>
          </table>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserMd className="text-slate-400 text-2xl" />
            </div>
            <p className="font-semibold text-slate-700 text-lg">{search ? 'No results found' : 'No doctors yet'}</p>
            <p className="text-slate-400 text-sm mt-1">{search ? `No match for "${search}"` : 'Click "Add Doctor" to add your first doctor.'}</p>
            {search && <button onClick={()=>setSearch('')} className="mt-4 text-cyan-600 text-sm font-semibold hover:underline">Clear search</button>}
            {!search && (
              <button
                onClick={seedDoctors}
                disabled={seeding}
                className="mt-5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 rounded-xl text-sm font-semibold transition flex items-center gap-2 mx-auto"
              >
                {seeding ? <><FaSpinner className="animate-spin" /> Seeding…</> : '⚡ Load 6 demo doctors'}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{['Doctor','Specialty','Hospital','Rating','Status','Actions'].map(h=>(
                  <th key={h} className={`text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${h==='Hospital'?'hidden lg:table-cell':''}`}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((d,i) => (
                  <tr key={d._id} className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i%2===1?'bg-slate-50/30':''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img src={mediaUrl(d.image)||`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name||'D')}&background=e0f2fe&color=0369a1`}
                            alt={d.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                            onError={e=>{e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name||'D')}&background=e0f2fe&color=0369a1`;}} />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${d.available?'bg-emerald-400':'bg-slate-300'}`}/>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{d.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{d.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-xs font-semibold">{d.specialty}</span></td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden lg:table-cell max-w-[180px] truncate">{d.hospital}</td>
                    <td className="px-5 py-4"><span className="flex items-center gap-1 font-semibold text-slate-800"><FaStar className="text-amber-400 text-xs"/>{Number(d.rating||0).toFixed(1)}</span></td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${d.available?'bg-emerald-100 text-emerald-700 border border-emerald-200':'bg-red-100 text-red-600 border border-red-200'}`}>
                        {d.available?'● Available':'● Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={()=>openEdit(d)} className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition"><FaEdit className="text-sm"/></button>
                        <button onClick={()=>handleDelete(d._id,d.name)} disabled={deletingId===d._id} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition disabled:opacity-50">
                          {deletingId===d._id?<FaSpinner className="text-sm text-red-400 animate-spin"/>:<FaTrash className="text-sm"/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && doctors.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs text-slate-400">{filtered.length} of {doctors.length} doctors</p>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"/>MongoDB
            </span>
          </div>
        )}
      </div>

      {/* ═══════════════ MODAL ═══════════════ */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 border border-slate-200">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black text-slate-900">{modal==='add'?'Add New Doctor':'Edit Doctor'}</h2>
                <p className="text-slate-400 text-xs mt-0.5">{modal==='add'?'Saved to MongoDB instantly':`Editing: ${form.name}`}</p>
              </div>
              <button onClick={close} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500"><FaTimes/></button>
            </div>

            <form onSubmit={handleSave} className="px-7 py-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {[['Full Name *','name','Dr. Jane Smith',true],['Role / Title *','role','Senior Cardiologist',true]].map(([lb,k,ph,req])=>(
                  <div key={k}>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{lb}</label>
                    <input required={req} value={form[k]} onChange={e=>f(k,e.target.value)} placeholder={ph}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"/>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Specialty *</label>
                  <select required value={form.specialty} onChange={e=>f('specialty',e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 transition appearance-none cursor-pointer">
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Experience *</label>
                  <input required value={form.exp} onChange={e=>f('exp',e.target.value)} placeholder="15 Yrs"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"/>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Hospital *</label>
                  <input required value={form.hospital} onChange={e=>f('hospital',e.target.value)} placeholder="Apollo Hospital, Mumbai"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Rating — <span className="text-amber-500 font-bold">{Number(form.rating).toFixed(1)} ★</span>
                  </label>
                  <input type="range" min="1" max="5" step="0.1" value={form.rating} onChange={e=>f('rating',e.target.value)}
                    className="w-full accent-cyan-500 mt-3 cursor-pointer"/>
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1.0</span><span>3.0</span><span>5.0</span></div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Languages Spoken</label>
                <input value={form.langs} onChange={e=>f('langs',e.target.value)} placeholder="English, Hindi, French"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 placeholder-slate-400 transition"/>
              </div>

              {/* Image upload zone */}
              <ImageZone
                preview={imgPreview}
                onFile={handleFile}
                onUrl={url => { f('image', url); if (url) { setImgFile(null); setImgPreview(url); } }}
                urlVal={form.image}
                progress={imgProg}
                uploading={uploading}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bio / Description</label>
                <textarea rows={3} value={form.bio} onChange={e=>f('bio',e.target.value)} placeholder="Fellowship-trained at… Specialist in…"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white text-slate-900 resize-none transition"/>
              </div>

              {/* Availability toggle */}
              <div onClick={()=>f('available',!form.available)}
                className="flex items-center gap-4 cursor-pointer select-none p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${form.available?'bg-cyan-500':'bg-slate-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.available?'translate-x-6':'translate-x-1'}`}/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{form.available?'✓ Available for appointments':'Currently unavailable'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Shown as status badge on the doctors page</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={close} disabled={saving||uploading}
                  className="px-6 py-2.5 border border-slate-300 rounded-xl text-sm text-slate-700 hover:bg-slate-100 font-medium transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={saving||uploading}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 min-w-[130px] justify-center">
                  {(saving||uploading)?<><FaSpinner className="animate-spin"/>{uploading?'Uploading…':'Saving…'}</> : modal==='add'?'+ Add Doctor':'✓ Save Changes'}
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
