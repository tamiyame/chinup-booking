import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import MyCoursesPage from './pages/MyCoursesPage.jsx';
import CoachesPage from './pages/CoachesPage.jsx';
import CoachDetailPage from './pages/CoachDetailPage.jsx';
import BookingDonePage from './pages/BookingDonePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) {
    const dest = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect=${dest}`} replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!['admin', 'owner'].includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        border: '3px solid var(--brand-100)',
        borderTopColor: 'var(--brand-600)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><CoursesPage /></RequireAuth>} />
      <Route path="/my" element={<RequireAuth><MyCoursesPage /></RequireAuth>} />
      <Route path="/coaches" element={<RequireAuth><CoachesPage /></RequireAuth>} />
      <Route path="/coaches/:coachId" element={<RequireAuth><CoachDetailPage /></RequireAuth>} />
      <Route path="/booking-done" element={<RequireAuth><BookingDonePage /></RequireAuth>} />
      <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
