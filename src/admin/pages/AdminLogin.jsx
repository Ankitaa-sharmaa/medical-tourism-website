import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaEnvelope, FaLock, FaHospital,
  FaEye, FaEyeSlash, FaExclamationTriangle, FaExternalLinkAlt,
} from 'react-icons/fa';

// ─── Firebase v10-12 error code → message ────────────────────
// Firebase v10+ uses auth/invalid-credential as the unified code
// for wrong email/password. Both legacy and new codes are handled.
const FIREBASE_ERRORS = {
  // ── wrong credentials ──
  'auth/invalid-credential':     'Incorrect email or password. Please check and try again.',
  'auth/wrong-password':         'Incorrect password. Please try again.',
  'auth/user-not-found':         'No account found with this email address.',

  // ── API key problems ── most common on Vercel deployments ──
  'auth/api-key-not-valid':      '__VERCEL_KEY__',
  'auth/invalid-api-key':        '__VERCEL_KEY__',
  'auth/app-not-authorized':     '__VERCEL_KEY__',

  // ── account / auth setup ──
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/user-disabled':          'This account has been disabled. Contact the administrator.',
  'auth/operation-not-allowed':  'Email/Password sign-in is not enabled in Firebase Console. Go to Authentication → Sign-in method → enable Email/Password.',

  // ── environment / network ──
  'auth/unauthorized-domain':    'This domain is not authorised in Firebase. Add your Vercel URL in Firebase Console → Authentication → Settings → Authorised domains.',
  'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
  'auth/too-many-requests':      'Too many failed login attempts. Please wait a few minutes and try again.',
  'auth/internal-error':         'Firebase internal error. Please try again.',
};

// Sentinel — renders the Vercel setup guide instead of plain text
const VERCEL_KEY_SENTINEL = '__VERCEL_KEY__';

const getErrorInfo = (err) => {
  const code = err?.code || 'unknown';
  console.error('[MedTour Login] error code:', code, '| message:', err?.message);
  const msg = FIREBASE_ERRORS[code];
  if (!msg) return { text: `Login failed (${code}). See the browser console for details.`, isKeyError: false };
  return { text: msg, isKeyError: msg === VERCEL_KEY_SENTINEL, code };
};

// ─── Vercel Env-var setup guide (shown for key errors) ────────
const VercelGuide = ({ code }) => (
  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm space-y-3">
    <p className="font-bold text-red-700 flex items-center gap-2">
      <FaExclamationTriangle /> Firebase API key rejected
      <code className="ml-auto font-mono text-xs bg-red-100 px-2 py-0.5 rounded">{code}</code>
    </p>

    <p className="text-red-700 leading-relaxed">
      The Firebase API key used during the Vercel build is missing or wrong.
      Vite inlines env vars <strong>at build time</strong>, so you must set them
      in Vercel and then redeploy.
    </p>

    <div className="bg-white border border-red-200 rounded-xl p-3 space-y-1.5">
      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
        Steps to fix on Vercel
      </p>
      {[
        ['1', 'Open your Vercel project dashboard'],
        ['2', 'Go to Settings → Environment Variables'],
        ['3', 'Add all 6 variables below (Production scope)'],
        ['4', 'Click Save, then Deployments → Redeploy'],
      ].map(([n, label]) => (
        <div key={n} className="flex items-start gap-2 text-xs text-slate-600">
          <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">{n}</span>
          {label}
        </div>
      ))}
    </div>

    <div className="bg-slate-900 rounded-xl p-3 font-mono text-xs leading-relaxed space-y-0.5">
      {[
        'VITE_FIREBASE_API_KEY',
        'VITE_FIREBASE_AUTH_DOMAIN',
        'VITE_FIREBASE_PROJECT_ID',
        'VITE_FIREBASE_STORAGE_BUCKET',
        'VITE_FIREBASE_MESSAGING_SENDER_ID',
        'VITE_FIREBASE_APP_ID',
      ].map(v => (
        <div key={v} className="flex items-center gap-2">
          <span className="text-emerald-400">{v}</span>
          <span className="text-slate-500">=</span>
          <span className="text-amber-300">your_value_here</span>
        </div>
      ))}
    </div>

    <p className="text-xs text-red-600">
      ⚠️ Values are copied from Firebase Console → Project Settings → Your Apps → Web App config.
      Do NOT wrap values in quotes. Paste the raw value only.
    </p>
  </div>
);

// ─── Login Page ───────────────────────────────────────────────
const AdminLogin = () => {
  const { user, signIn, isFirebaseReady } = useAuth();
  const navigate = useNavigate();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorInfo(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorInfo(getErrorInfo(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center justify-center p-4">

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
              <p className="text-amber-700 mt-1 leading-relaxed text-xs">
                Set all <code className="bg-amber-100 px-1 rounded">VITE_FIREBASE_*</code> variables in
                Vercel → Settings → Environment Variables, then redeploy.
              </p>
            </div>
          )}

          {/* API key error — full Vercel guide */}
          {errorInfo?.isKeyError && <VercelGuide code={errorInfo.code} />}

          {/* All other errors */}
          {errorInfo && !errorInfo.isKeyError && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2 leading-relaxed">
              <FaExclamationTriangle className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{errorInfo.text}</span>
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
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@medtour.com"
                  required
                  autoComplete="email"
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
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-1 text-center">
            <p className="text-xs text-slate-400">Protected area · Authorised personnel only</p>
            {isFirebaseReady && (
              <p className="text-xs text-slate-300 font-mono">
                project: {import.meta.env.VITE_FIREBASE_PROJECT_ID}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
