import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import ProfileSetup from './pages/ProfileSetup';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return null;
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Navigate to="/login" />} />

        {/* Requires login */}
        <Route path="/calendar"       element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/profile"        element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/setup"  element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
        <Route path="/admin/register" element={<PrivateRoute><AdminRegister /></PrivateRoute>} />
        <Route path="/settings"       element={<PrivateRoute><div className="page"><h1 className="page-title">Settings</h1><p className="page-subtitle">Coming soon.</p></div></PrivateRoute>} />

        {/* Admin only */}
        <Route path="/admin"          element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard"      element={<AdminRoute><Dashboard /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*"               element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
