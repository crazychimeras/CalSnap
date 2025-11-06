import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Onboarding from './views/Onboarding.jsx';
import Dashboard from './views/Dashboard.jsx';
import Camera from './views/Camera.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
          }
        />
        <Route path="/onboarding" element={user ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard /> : <Navigate to="/onboarding" replace />
          }
        />
        <Route
          path="/camera"
          element={
            user ? <Camera /> : <Navigate to="/onboarding" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
