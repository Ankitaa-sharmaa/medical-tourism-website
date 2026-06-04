import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const {
  VITE_FIREBASE_API_KEY:             apiKey,
  VITE_FIREBASE_AUTH_DOMAIN:         authDomain,
  VITE_FIREBASE_PROJECT_ID:          projectId,
  VITE_FIREBASE_STORAGE_BUCKET:      storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_APP_ID:              appId,
} = import.meta.env;

const isConfigured =
  apiKey &&
  apiKey !== 'your_api_key_here' &&
  authDomain &&
  projectId &&
  appId;

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
    '[MedTour] Firebase env vars missing or placeholder. ' +
    'Admin login requires real VITE_FIREBASE_* values in .env'
  );
}

export { auth, db, storage };
export default app;
