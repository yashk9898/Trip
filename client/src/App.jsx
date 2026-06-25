import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CreatorBadge from './components/CreatorBadge';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import PublicSharePage from './pages/PublicSharePage';

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/share/:token" element={<PublicSharePage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryDetailPage /></ProtectedRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
              <h2>404 - Page Not Found</h2>
            </div>
          } />
        </Routes>
      </AnimatePresence>
      <CreatorBadge />
    </>
  );
}

export default App;
