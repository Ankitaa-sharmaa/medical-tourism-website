import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: restore session from localStorage and verify the token
  useEffect(() => {
    const token = localStorage.getItem('medtour_token');
    const saved  = localStorage.getItem('medtour_user');
    if (token && saved) {
      api.get('/auth/verify')
        .then(() => setUser(JSON.parse(saved)))
        .catch(() => {
          localStorage.removeItem('medtour_token');
          localStorage.removeItem('medtour_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('medtour_token', data.token);
    localStorage.setItem('medtour_user',  JSON.stringify({ email: data.email }));
    setUser({ email: data.email });
  };

  const logOut = () => {
    localStorage.removeItem('medtour_token');
    localStorage.removeItem('medtour_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
