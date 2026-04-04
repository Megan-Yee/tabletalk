import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/org/members`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setOrg(data.org);
      setMembers(data.members);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API}/org/generate-code`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success('New invite code generated!');
      fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setGenerating(false); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(org.inviteCode);
    toast.success('Code copied!');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

  if (loading) return <div className="page"><p className="page-subtitle">Loading dashboard…</p></div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{org?.name}</h1>
        <span className="role-badge admin">Admin</span>
      </div>
      <p className="page-subtitle">Manage your organization members and invite codes.</p>

      {/* Invite Code */}
      <div className="glass-card glass-card-wide" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Invite Code</h2>
        {org?.inviteCode && org?.isInviteValid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div className="invite-code-display">{org.inviteCode}</div>
              <button className="btn-secondary" onClick={copyCode}>Copy</button>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)' }}>Expires: {formatDate(org.inviteCodeExpiry)}</p>
          </>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '8px' }}>
            {org?.inviteCode ? 'Your invite code has expired.' : 'No active invite code.'}
          </p>
        )}
        <button className="btn-primary" onClick={handleGenerateCode} disabled={generating} style={{ marginTop: '16px', width: 'auto', padding: '12px 28px' }}>
          {generating ? 'Generating…' : org?.inviteCode ? 'Generate New Code' : 'Generate Invite Code'}
        </button>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
          Valid for 3 days. Generating a new code invalidates the old one.
        </p>
      </div>

      {/* Members */}
      <div className="glass-card glass-card-wide">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Members ({members.length})</h2>
        {members.length === 0
          ? <p style={{ color: 'rgba(255,255,255,0.45)' }}>No members yet. Share your invite code to get started.</p>
          : (
            <div className="members-table">
              <div className="members-table-header">
                <span>#</span><span>Name</span><span>Email</span>
              </div>
              {members.map((m, i) => (
                <div className="members-table-row" key={m._id}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>{i + 1}</span>
                  <span>{m.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>{m.email}</span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
