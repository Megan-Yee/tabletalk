import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export default function AdminRegister() {
  const { token, user, login } = useAuth();
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role === 'admin') {
    return (
      <div className="page">
        <h1 className="page-title">You're already an admin</h1>
        <p className="page-subtitle">Head to your Admin Dashboard to manage your organization.</p>
        <button className="btn-primary" style={{ width: 'auto', padding: '14px 36px' }} onClick={() => navigate('/admin')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!orgName.trim()) { toast.error('Please enter an organization name'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/org/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orgName: orgName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      login({ ...user, role: 'admin' }, token);
      toast.success(`Organization "${orgName}" created!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Create an Organization</h1>
      <p className="page-subtitle">
        As an admin, you can generate invite codes and manage members under your organization.
      </p>
      <div className="glass-card">
        <div className="form-group">
          <label>Organization Name</label>
          <input type="text" placeholder="e.g. Rho Innovate 2025" value={orgName} onChange={e => setOrgName(e.target.value)} maxLength={60} />
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
            Must be unique. Cannot be changed later.
          </p>
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating…' : 'Claim Organization'}
        </button>
        <div className="form-footer">
          <a href="/profile" style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.9rem' }}>← Back to profile</a>
        </div>
      </div>
    </div>
  );
}
