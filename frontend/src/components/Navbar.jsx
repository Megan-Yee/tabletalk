import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import brandLogo from '../handmade components/transparent black logo.svg';

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );
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

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleHowItWorks = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isActive = (path) => location.pathname === path;
  const firstName = user?.name?.split(' ')[0] || 'You';
  const onDark = location.pathname === '/';
  const navLinkStyle = {
    fontFamily: "'Cabin', sans-serif",
    textTransform: 'none',
    letterSpacing: 'normal',
    fontSize: '0.95rem',
    fontWeight: 500,
    lineHeight: 1,
  };

  return (
    <nav
      className={`nav-wrap${onDark ? ' nav-on-dark' : ''}`}
      style={{
        padding: '32px',
        position: 'relative',
      }}
    >
      <div
        className="nav-pill"
        style={{
          alignItems: 'flex-end',
          ...(isMobile ? { gridTemplateColumns: '1fr 1fr' } : {}),
        }}
      >
        <ul className="nav-links" style={{ alignItems: 'flex-end', alignSelf: 'flex-end' }}>
          {isLoggedIn && (
            <li><Link to="/calendar" className={isActive('/calendar') ? 'nav-active' : ''} style={navLinkStyle}>Calendar</Link></li>
          )}
          {isLoggedIn && user?.role === 'admin' && (
            <li><Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''} style={navLinkStyle}>Dashboard</Link></li>
          )}
          <li><Link to="/#how-it-works" style={navLinkStyle} onClick={handleHowItWorks}>How it works</Link></li>
        </ul>

        <Link
          to="/"
          className="nav-brand"
          style={{
            ...(isMobile ? { justifySelf: 'start' } : {}),
            lineHeight: 1,
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            fontSize: isMobile ? '0.95rem' : '1.2rem',
          }}
        >
          <img
            src={brandLogo}
            alt="Seatd"
            style={{ height: '1em', display: 'block' }}
          />
          <span style={{ opacity: 0.4, lineHeight: 1 }}>•</span>
          <span style={{ lineHeight: 1 }}>Seatd</span>
        </Link>

        <div className="nav-right" style={{ alignSelf: 'flex-end' }}>
          {isLoggedIn ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button className="nav-user-btn" onClick={() => setDropdownOpen(o => !o)} aria-label="Account menu">
                <ProfileIcon />
                <span className="nav-user-name">{firstName}</span>
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
            <Link to="/login" className="nav-user-btn nav-user-btn-icon" aria-label="Sign in">
              <ProfileIcon />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
