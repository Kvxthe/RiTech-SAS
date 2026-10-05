import { useCallback, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/ui/Layout';
import LoginView from './views/LoginView';
import TrackingView from './views/TrackingView';
import LotsDashboard from './views/LotsDashboard';

const SESSION_KEY = 'ritech.session';

const readStoredSession = () => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function ProtectedRoute({ isAuthenticated }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

function LoginRoute({ session, onLogin }) {
  const location = useLocation();
  if (session) {
    return <Navigate to={location.state?.from || '/dashboard'} replace />;
  }
  return <LoginView onLogin={onLogin} />;
}

export default function App() {
  const [session, setSession] = useState(readStoredSession);

  const handleLogin = useCallback((user) => {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      /* storage unavailable: session lives in memory only */
    }
    setSession(user);
  }, []);

  const handleLogout = useCallback(() => {
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* storage unavailable */
    }
    setSession(null);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/seguimiento" replace />} />
        <Route path="/seguimiento" element={<TrackingView />} />
        <Route path="/login" element={<LoginRoute session={session} onLogin={handleLogin} />} />

        <Route element={<ProtectedRoute isAuthenticated={Boolean(session)} />}>
          <Route element={<Layout user={session} onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<LotsDashboard showSummary />} />
            <Route path="/lotes" element={<LotsDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
