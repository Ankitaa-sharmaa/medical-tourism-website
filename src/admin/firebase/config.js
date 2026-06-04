import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// .trim() on every value — copy-pasting into Vercel often adds
// leading/trailing whitespace which causes auth/api-key-not-valid
const apiKey            = (import.meta.env.VITE_FIREBASE_API_KEY            || '').trim();
const authDomain        = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '').trim();
const projectId         = (import.meta.env.VITE_FIREBASE_PROJECT_ID         || '').trim();
const storageBucket     = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '').trim();
const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '').trim();
const appId             = (import.meta.env.VITE_FIREBASE_APP_ID             || '').trim();

// Helper: show first 8 + last 4 chars so you can verify in Vercel logs
// without exposing the full key
const mask = (v) => v ? `${v.slice(0, 8)}…${v.slice(-4)}` : '❌ MISSING';

const isConfigured =
  apiKey && apiKey !== 'your_api_key_here' &&
  authDomain && projectId && appId;

// Always log so you can open DevTools / Vercel Function Logs and confirm
console.log(
  '[MedTour] Firebase env check\n',
  ` VITE_FIREBASE_API_KEY:            ${mask(apiKey)}\n`,
  ` VITE_FIREBASE_AUTH_DOMAIN:        ${mask(authDomain)}\n`,
  ` VITE_FIREBASE_PROJECT_ID:         ${mask(projectId)}\n`,
  ` VITE_FIREBASE_STORAGE_BUCKET:     ${mask(storageBucket)}\n`,
  ` VITE_FIREBASE_MESSAGING_SENDER_ID:${mask(messagingSenderId)}\n`,
  ` VITE_FIREBASE_APP_ID:             ${mask(appId)}\n`,
  ` isConfigured: ${isConfigured}`
);

let app     = null;
let auth    = null;
let db      = null;
let storage = null;

if (isConfigured) {
  try {
    app = getApps().length === 0
      ? initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })
      : getApps()[0];

    auth    = getAuth(app);
    db      = getFirestore(app);
    storage = getStorage(app);

    console.log('[MedTour] Firebase initialised — project:', projectId);
  } catch (err) {
    console.error('[MedTour] Firebase init error:', err.code, err.message);
  }
} else {
  console.warn(
    '[MedTour] Firebase NOT initialised — one or more VITE_FIREBASE_* ' +
    'env vars are missing. Set them in Vercel → Settings → Environment Variables.'
  );
}

export { auth, db, storage };
export default app;
