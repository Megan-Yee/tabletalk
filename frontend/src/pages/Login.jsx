import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'admin-register'
  const [form, setForm] = useState({ name: '', email: '', password: '', orgName: '' });
  const [loading, setLoading] = useState(false);
  const { login, profileComplete } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
      toast.success(`Welcome to Seatd, ${data.user.name}!`);
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
    if (!form.orgName.trim()) { toast.error('Please enter an organization name'); return; }
    setLoading(true);
    try {
      // Step 1: Register the user account
      const regRes = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.name, email: form.email, password: form.password }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.msg || 'Registration failed');

      // Step 2: Create the organization (makes them an admin)
      const orgRes = await fetch(`${API}/org/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regData.token}` },
        body: JSON.stringify({ orgName: form.orgName.trim() }),
      });
      const orgData = await orgRes.json();
      if (!orgRes.ok) throw new Error(orgData.msg || 'Could not create organization');

      // Step 3: Log in with updated admin role
      login({ ...regData.user, role: 'admin' }, regData.token);
      toast.success(`Organization "${form.orgName}" created! Welcome, ${regData.user.name}.`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setForm({ name: '', email: '', password: '', orgName: '' });
  };

  return (
    <div className="page">
      {/* Mode tabs */}
      <div className="tab-bar" style={{ marginBottom: '32px' }}>
        <button className={`tab-btn ${mode === 'login' ? 'tab-btn-active' : ''}`} onClick={() => switchMode('login')}>
          Login
        </button>
        <button className={`tab-btn ${mode === 'register' ? 'tab-btn-active' : ''}`} onClick={() => switchMode('register')}>
          Register
        </button>
        <button className={`tab-btn ${mode === 'admin-register' ? 'tab-btn-active' : ''}`} onClick={() => switchMode('admin-register')}>
          Create Organization
        </button>
      </div>

      {/* Login */}
      {mode === 'login' && (
        <div className="glass-card">
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '28px' }}>Welcome back</h1>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
          </div>
          <div className="remember-forgot">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
          <div className="form-footer">
            New here?{' '}
            <button onClick={() => switchMode('register')} style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
              Create an account
            </button>
          </div>
        </div>
      )}

      {/* User Register */}
      {mode === 'register' && (
        <div className="glass-card">
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '28px' }}>Create Account</h1>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
          </div>
          <button className="btn-primary" onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
          <div className="form-footer">
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
              Login
            </button>
          </div>
        </div>
      )}

      {/* Admin Register */}
      {mode === 'admin-register' && (
        <div className="glass-card">
          <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Organization</h1>
          <p className="page-subtitle" style={{ fontSize: '1rem', marginBottom: '28px', textAlign: 'left' }}>
            Set up an admin account and claim your organization name. You'll be able to invite members and manage events.
          </p>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Organization Name</label>
            <input type="text" name="orgName" placeholder="e.g. Rho Innovate 2025" value={form.orgName} onChange={handleChange} maxLength={60} />
            <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.38)', marginTop: '5px' }}>
              Must be unique. Cannot be changed later.
            </p>
          </div>
          <button className="btn-primary" onClick={handleAdminRegister} disabled={loading}>
            {loading ? 'Setting up…' : 'Create Organization'}
          </button>
          <div className="form-footer">
            Already have an account?{' '}
            <button onClick={() => switchMode('login')} style={{ background: 'none', border: 'none', color: 'var(--green-dark)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
