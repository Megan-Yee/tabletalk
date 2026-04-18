import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/">
        <img src="/tabletalklogo.png" className="logo" alt="TableTalk Logo" />
      </Link>
      <ul>
        <li>
          <Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link>
        </li>

        {isLoggedIn ? (
          <>
            <li>
              <Link to="/calendar" className={isActive('/calendar') ? 'nav-active' : ''}>Calendar</Link>
            </li>
            <li style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                className="nav-link"
                onClick={() => setDropdownOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {user?.name}
                <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>▼</span>
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}>Admin Dashboard</Link>
                  )}
                  <Link to="/settings" onClick={() => setDropdownOpen(false)}>Settings</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className={isActive('/login') ? 'nav-active' : ''}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
