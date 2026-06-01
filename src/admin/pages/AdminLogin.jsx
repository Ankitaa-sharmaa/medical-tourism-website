import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaHospital, FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLogin = () => {
  const { user, signIn, isFirebaseReady } = useAuth();
  const navigate              = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Already logged in → go straight to dashboard
  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-200 mb-4">
              <FaHospital className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-1">MedTour — Secure Access</p>
          </div>

          {/* Firebase not configured warning */}
          {!isFirebaseReady && (
            <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-sm leading-relaxed">
              <p className="font-bold mb-1">⚠️ Firebase not configured</p>
              <p>Create a <code className="bg-amber-100 px-1 rounded">.env</code> file in your project root with your Firebase keys. See the setup guide below.</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medtour.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected area · Authorised personnel only
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
