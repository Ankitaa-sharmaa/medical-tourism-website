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
    // auth is null when Firebase isn't configured — skip listener, stay logged out
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = (email, password) => {
    if (!auth) return Promise.reject(new Error('Firebase is not configured. Check your .env file.'));
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
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
