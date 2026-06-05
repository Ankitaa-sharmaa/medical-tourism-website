import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./admin/contexts/AuthContext";

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
    // AuthProvider wraps everything so both frontend and admin share auth state
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
  );
}

export default App;
