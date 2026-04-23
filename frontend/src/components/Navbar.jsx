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
  const firstName = user?.name?.split(' ')[0] || 'You';

  return (
    <nav className="nav-wrap">
      <div className="nav-pill">
        <Link to="/" className="nav-brand">
          <img src="/transparent_black_logo.svg" alt="Seatd" />
          <span>Seatd</span>
        </Link>

        <div className="nav-right">
          <ul className="nav-links">
            <li><Link to="/" className={isActive('/') ? 'nav-active' : ''}>Home</Link></li>
            {isLoggedIn && (
              <li><Link to="/calendar" className={isActive('/calendar') ? 'nav-active' : ''}>Calendar</Link></li>
            )}
            {isLoggedIn && user?.role === 'admin' && (
              <li><Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''}>Dashboard</Link></li>
            )}
          </ul>

          <div className="nav-cta">
            {isLoggedIn ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button className="nav-user-btn" onClick={() => setDropdownOpen(o => !o)}>
                  {firstName}
                  <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>▼</span>
                </button>
                {dropdownOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <span className="nav-dropdown-name">{user?.name}</span>
                      <span className="nav-dropdown-role">{user?.role || 'member'}</span>
                    </div>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                    {user?.role === 'admin' && (
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                    )}
                    <Link to="/settings" onClick={() => setDropdownOpen(false)}>Settings</Link>
                    <div className="nav-dropdown-divider" />
                    <button className="nav-dropdown-logout" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-pill-btn">Get Started</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
