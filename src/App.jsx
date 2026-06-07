import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./admin/contexts/AuthContext";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "1.5rem" }}>
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.5rem" }}>Something went wrong</h1>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>An unexpected error occurred. Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#06b6d4", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "9999px", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Frontend ──
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// ── Admin ──
import AdminLogin        from "./admin/pages/AdminLogin";
import AdminDashboard    from "./admin/pages/AdminDashboard";
import AdminDoctors      from "./admin/pages/AdminDoctors";
import AdminAppointments from "./admin/pages/AdminAppointments";
import AdminServices     from "./admin/pages/AdminServices";
import AdminTestimonials from "./admin/pages/AdminTestimonials";
import AdminQueries      from "./admin/pages/AdminQueries";
import ProtectedRoute    from "./admin/components/ProtectedRoute";

function App() {
  return (
    <ErrorBoundary>
    {/* AuthProvider wraps everything so both frontend and admin share auth state */}
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* ── Public Frontend Routes (with navbar + footer) ── */}
          <Route path="/"         element={<Layout><Home /></Layout>} />
          <Route path="/about"    element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/doctors"  element={<Layout><Doctors /></Layout>} />
          <Route path="/contact"  element={<Layout><Contact /></Layout>} />

          {/* ── Admin Routes (no Layout wrapper — own sidebar/header) ── */}
          <Route path="/admin"              element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/login"        element={<AdminLogin />} />
          <Route path="/admin/dashboard"    element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors"      element={<ProtectedRoute><AdminDoctors /></ProtectedRoute>} />
          <Route path="/admin/appointments" element={<ProtectedRoute><AdminAppointments /></ProtectedRoute>} />
          <Route path="/admin/services"     element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/queries"      element={<ProtectedRoute><AdminQueries /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
