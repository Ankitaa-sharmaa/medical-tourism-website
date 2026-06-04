import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
      (err) => {
        // onAuthStateChanged observer error (e.g. network issue)
        console.error('[MedTour Auth] state observer error:', err.code, err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys to your .env file.');
    }
    // Let the raw Firebase error propagate — AdminLogin maps error codes to messages
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut, isFirebaseReady: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
