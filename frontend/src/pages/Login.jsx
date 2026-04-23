import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const CoffeeLogo = () => (
  <div className="auth-logo">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4783A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>
      <line x1="6.5" y1="2" x2="6.5" y2="5"/>
      <line x1="10" y1="2" x2="10" y2="5"/>
      <line x1="13.5" y1="2" x2="13.5" y2="5"/>
    </svg>
  </div>
);

export default function Login() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [registerTab, setRegisterTab] = useState('join'); // 'join' | 'create'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', orgName: '' });
  const [loading, setLoading] = useState(false);
  const { login, profileComplete } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => setForm({ name: '', email: '', password: '', confirmPassword: '', orgName: '' });

  const handleLogin = async () => {
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Login failed');
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(profileComplete ? '/' : '/profile/setup');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Registration failed');
      login(data.user, data.token);
      toast.success(`Welcome to Table Talk, ${data.user.name}!`);
      navigate('/profile/setup');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (!form.orgName.trim()) { toast.error('Please enter an organization name'); return; }
    setLoading(true);
    try {
      const regRes = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.name, email: form.email, password: form.password }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.msg || 'Registration failed');

      const orgRes = await fetch(`${API}/org/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regData.token}` },
        body: JSON.stringify({ orgName: form.orgName.trim() }),
      });
      const orgData = await orgRes.json();
      if (!orgRes.ok) throw new Error(orgData.msg || 'Could not create organization');

      login({ ...regData.user, role: 'admin' }, orgData.token);
      toast.success(`Organization "${form.orgName}" created! Welcome, ${regData.user.name}.`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => { resetForm(); setMode('register'); };
  const goToLogin = () => { resetForm(); setMode('login'); };

  if (mode === 'login') {
    return (
      <div className="auth-page">
        <button className="auth-back" onClick={() => navigate('/')}>← Back</button>
        <div className="auth-card">
          <CoffeeLogo />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Table Talk account</p>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div className="remember-row">
            <label><input type="checkbox" /> Remember me for 30 days</label>
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="auth-divider">OR</div>

          <div className="form-footer">
            Don't have an account?{' '}
            <button onClick={goToRegister} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 600, padding: 0 }}>
              Sign up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={goToLogin}>← Back</button>
      <div className="auth-card">
        <CoffeeLogo />
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Join Table Talk and start organizing meaningful social connections</p>

        <div className="tab-bar" style={{ marginBottom: 24, width: '100%', justifyContent: 'stretch' }}>
          <button
            className={`tab-btn ${registerTab === 'join' ? 'tab-btn-active' : ''}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => { setRegisterTab('join'); resetForm(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Join Organization
          </button>
          <button
            className={`tab-btn ${registerTab === 'create' ? 'tab-btn-active' : ''}`}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => { setRegisterTab('create'); resetForm(); }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            Create New
          </button>
        </div>

        {registerTab === 'join' && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input type="email" name="email" placeholder="john@company.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
            </div>
            <button className="btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating account…' : 'Join Organization'}
            </button>
          </>
        )}

        {registerTab === 'create' && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input type="email" name="email" placeholder="john@company.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Organization Name</label>
              <input type="text" name="orgName" placeholder="Acme Inc." value={form.orgName} onChange={handleChange} maxLength={60} />
              <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', marginTop: 5 }}>
                You'll receive an invite code to share with your team
              </p>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
            </div>
            <button className="btn-primary" onClick={handleAdminRegister} disabled={loading}>
              {loading ? 'Setting up…' : 'Create Organization'}
            </button>
          </>
        )}

        <div className="form-footer" style={{ marginTop: 16 }}>
          Already have an account?{' '}
          <button onClick={goToLogin} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 600, padding: 0 }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
