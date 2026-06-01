import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Pull every key from Vite env
const {
  VITE_FIREBASE_API_KEY:            apiKey,
  VITE_FIREBASE_AUTH_DOMAIN:        authDomain,
  VITE_FIREBASE_PROJECT_ID:         projectId,
  VITE_FIREBASE_STORAGE_BUCKET:     storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID:             appId,
} = import.meta.env;

// True only when all six keys are present AND not the placeholder value
const isConfigured =
  apiKey && apiKey !== 'your_api_key_here' &&
  authDomain && projectId && appId;

if (!isConfigured) {
  console.warn(
    '\n🔴 [MedTour Admin] Firebase is NOT configured.\n' +
    '   1. Copy .env.example → .env\n' +
    '   2. Paste your real Firebase keys into .env\n' +
    '   3. Restart the dev server (npm run dev)\n' +
    '   The frontend still works; only admin features need Firebase.\n'
  );
}

// Safe initialisation — never throw, so the frontend keeps running
let app     = null;
let auth    = null;
let db      = null;
let storage = null;

if (isConfigured) {
  try {
    app     = getApps().length === 0
      ? initializeApp({ apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId })
      : getApps()[0];
    auth    = getAuth(app);
    db      = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.error('[MedTour Admin] Firebase init failed:', err.message);
  }
}

export { auth, db, storage };
export default app;
