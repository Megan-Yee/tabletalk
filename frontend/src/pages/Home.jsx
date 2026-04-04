import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className="page">
      <div className="hero-section">
        <div className="hero-badge">Precision Agriculture · Sustainability</div>
        <h1 className="page-title">Welcome to TableTalk</h1>
        <p className="page-subtitle">
          Each year, farmers apply herbicide to their crops to eliminate common weeds. Yet, excess
          herbicide application leads to increased amounts of glyphosate in groundwater, which can
          wreak havoc on the environment.
        </p>
        <p className="page-subtitle" style={{ marginTop: '-16px' }}>
          With our <Link to="/calculator" style={{ color: '#7ecfa0' }}>Green Solution Calculator</Link>,
          farmers can reduce herbicide usage by only targeting affected areas — and automatically see their cost savings.
        </p>
        {isLoggedIn && (
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>Welcome back, {user?.name}!</p>
        )}
        <div className="hero-cta-row">
          <Link to="/calculator" className="btn-primary" style={{ width: 'auto', padding: '14px 36px' }}>
            Try the Calculator
          </Link>
          {!isLoggedIn && <Link to="/register" className="btn-secondary">Create Account</Link>}
        </div>
      </div>
    </div>
  );
}
