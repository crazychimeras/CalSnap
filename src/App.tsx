import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';

function App() {
  const userProfile = localStorage.getItem('userProfile');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            userProfile ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          path="/dashboard"
          element={
            userProfile ? <Dashboard /> : <Navigate to="/onboarding" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
