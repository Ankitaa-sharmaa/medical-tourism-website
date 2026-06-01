import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/admin/login" replace />;

  return children;
};

export default ProtectedRoute;
