import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaHospital, FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa';

// ─── Firebase error code → human message ─────────────────────
// Firebase SDK v10+ uses auth/invalid-credential as the unified
// code for wrong email OR wrong password (replaces the old
// auth/user-not-found + auth/wrong-password split).
const FIREBASE_ERRORS = {
  'auth/invalid-credential':      'Incorrect email or password. Please check and try again.',
  'auth/wrong-password':          'Incorrect password. Please try again.',
  'auth/user-not-found':          'No account found with this email address.',
  'auth/invalid-email':           'Please enter a valid email address.',
  'auth/user-disabled':           'This account has been disabled. Contact the administrator.',
  'auth/too-many-requests':       'Too many failed attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed':  'Network error. Check your internet connection and try again.',
  'auth/invalid-api-key':         'Firebase API key is invalid. Check your .env / Vercel environment variables.',
  'auth/operation-not-allowed':   'Email/Password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method and enable it.',
  'auth/unauthorized-domain':     'This domain is not authorised in Firebase. Add it in Firebase Console → Authentication → Settings → Authorised domains.',
  'auth/internal-error':          'Firebase internal error. Please try again.',
  'auth/app-not-authorized':      'Firebase app is not authorised. Check your API key and authDomain in .env.',
};

const getErrorMessage = (err) => {
  const code = err?.code || '';
  console.error('[MedTour Login] Firebase error:', code, err?.message);
  return FIREBASE_ERRORS[code] || `Login failed (${code || 'unknown'}). Check the browser console for details.`;
};

// ─── Component ────────────────────────────────────────────────
const AdminLogin = () => {
  const { user, signIn, isFirebaseReady } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Already authenticated → skip login
  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-2xl shadow-lg shadow-cyan-200 mb-4">
              <FaHospital className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-1">MedTour — Secure Access</p>
          </div>

          {/* Firebase not configured */}
          {!isFirebaseReady && (
            <div className="mb-5 p-4 bg-amber-50 border border-amber-300 rounded-xl text-sm">
              <p className="font-bold text-amber-800 flex items-center gap-2">
                <FaExclamationTriangle /> Firebase not configured
              </p>
              <p className="text-amber-700 mt-1 leading-relaxed">
                Add your <code className="bg-amber-100 px-1 rounded">VITE_FIREBASE_*</code> keys to{' '}
                <code className="bg-amber-100 px-1 rounded">.env</code> (local) or Vercel Environment Variables (production) and redeploy.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 leading-relaxed flex items-start gap-2">
              <FaExclamationTriangle className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@medtour.com"
                  required
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition bg-white text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFirebaseReady}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected area · Authorised personnel only
          </p>

          {/* Vercel env var reminder */}
          {isFirebaseReady && (
            <p className="text-center text-xs text-slate-300 mt-2">
              Firebase project: {import.meta.env.VITE_FIREBASE_PROJECT_ID}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
