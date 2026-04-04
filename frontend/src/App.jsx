import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import IndexPage from './pages/IndexPage';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Sources from './pages/Sources';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Profile from './pages/Profile';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';

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
        <Route path="/"                element={<Home />} />
        <Route path="/index"           element={<IndexPage />} />
        <Route path="/calculator"      element={<Calculator />} />
        <Route path="/about"           element={<About />} />
        <Route path="/sources"         element={<Sources />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/profile/setup"   element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
        <Route path="/profile"         element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin/register"  element={<PrivateRoute><AdminRegister /></PrivateRoute>} />
        <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/settings"        element={<PrivateRoute><div className="page"><h1 className="page-title">Settings</h1><p className="page-subtitle">Coming soon.</p></div></PrivateRoute>} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
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
