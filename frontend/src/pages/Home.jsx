import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className="page">
      <div className="hero-section">
        <div className="hero-badge">Get a Table · be Seatd</div>
        <h1 className="page-title">Welcome to Seatd</h1>
        <p className="page-subtitle">
          Welcome to Seatd - a platform to plan small group bonding activities in only minutes.
        </p>
        <p className="page-subtitle" style={{ marginTop: '-16px' }}>
	</p>
        {isLoggedIn && (
          <p style={{ color: 'rgba(0,0,0,0.45)', marginBottom: '8px' }}>Welcome back, {user?.name}!</p>
        )}
        <div className="hero-cta-row">
          {!isLoggedIn && (
            <>
              <Link to="/register" className="btn-primary" style={{ width: 'auto', padding: '14px 36px' }}>
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </>
          )}
          {isLoggedIn && (
            <Link to="/calendar" className="btn-primary" style={{ width: 'auto', padding: '14px 36px' }}>
              View My Calendar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
