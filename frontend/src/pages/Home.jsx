import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CoffeeLogo = () => (
  <div className="logo-icon">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>
      <line x1="6.5" y1="2" x2="6.5" y2="5"/>
      <line x1="10" y1="2" x2="10" y2="5"/>
      <line x1="13.5" y1="2" x2="13.5" y2="5"/>
    </svg>
  </div>
);

const ShuffleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"/>
    <line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/>
    <line x1="15" y1="15" x2="21" y2="21"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="home-page">
      <div className="home-hero">
        <CoffeeLogo />
        <h1 className="page-title">Welcome to Table Talk</h1>
        <p className="page-subtitle">
          Break down silos and build stronger teams through randomized social gatherings that connect people across your organization
        </p>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon"><ShuffleIcon /></div>
          <h3 className="feature-title">Smart Randomization</h3>
          <p className="feature-desc">Our algorithm creates diverse groups so employees meet colleagues they don't usually interact with</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><CalendarIcon /></div>
          <h3 className="feature-title">Easy Scheduling</h3>
          <p className="feature-desc">Plan recurring social events with automated invites and calendar integration</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><PeopleIcon /></div>
          <h3 className="feature-title">Build Connections</h3>
          <p className="feature-desc">Foster cross-departmental relationships and strengthen company culture</p>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="cta-card">
          <p className="cta-welcome">Welcome back, {user?.name}!</p>
          <Link to="/calendar" className="btn-primary" style={{ display: 'block', textDecoration: 'none' }}>
            View My Calendar
          </Link>
        </div>
      ) : (
        <div className="cta-card">
          <h3 className="cta-title">Get Started Today</h3>
          <p className="cta-desc">Create a new organization or join your team with an invite code</p>
          <Link to="/login?tab=register" className="btn-primary" style={{ display: 'block', textDecoration: 'none', marginBottom: 10 }}>
            Create Account
          </Link>
          <Link to="/login" className="btn-secondary" style={{ display: 'block', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
