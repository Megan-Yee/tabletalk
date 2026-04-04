import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
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

  return (
    <nav className="navbar">
      <Link to="/"><img src="/tabletalklogo.png" className="logo" alt="TableTalk Logo" /></Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/calculator">Calculator</Link></li>
        <li><Link to="/index">Index</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/sources">Sources</Link></li>
        {isLoggedIn ? (
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
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
