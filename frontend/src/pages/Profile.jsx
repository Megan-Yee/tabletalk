import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const MBTI = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const HOBBIES = ['Hiking','Gaming','Cooking','Reading','Traveling','Photography','Music','Art & Drawing','Fitness','Yoga & Meditation','Dancing','Cycling','Swimming','Board Games','Movies & TV','Volunteering','Sports','Gardening','Writing','Coding'];
const ALLERGIES = ['None','Milk','Eggs','Fish','Shellfish','Tree Nuts','Peanuts','Wheat','Soybeans','Sesame'];
const BUDGETS = ['$','$$','$$$','$$$$'];
const GENDERS = ['Male','Female','Non-binary','Prefer not to say','Other'];

function Section({ title, children }) {
  return (
    <div className="profile-section">
      <h3 className="profile-section-title">{title}</h3>
      {children}
    </div>
  );
}

export default function Profile() {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [orgCode, setOrgCode] = useState('');
  const [joiningOrg, setJoiningOrg] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setProfile(data.profile);
      setForm({ gender: data.profile.gender, age: data.profile.age, budget: data.profile.budget, personalityType: data.profile.personalityType, hobbies: data.profile.hobbies, allergies: data.profile.allergies });
    } catch { toast.error('Could not load profile'); }
    finally { setLoading(false); }
  };

  const toggleChip = (key, val, single = false) => {
    if (single) { setForm(f => ({ ...f, [key]: val })); return; }
    setForm(f => { const arr = f[key] || []; return { ...f, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }; });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setProfile(data.profile);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message); }
  };

  const handleJoinOrg = async () => {
    if (!orgCode) return;
    setJoiningOrg(true);
    try {
      const res = await fetch(`${API}/profile/join-org`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orgCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success(data.msg);
      setOrgCode('');
      fetchProfile();
    } catch (err) { toast.error(err.message); }
    finally { setJoiningOrg(false); }
  };

  if (loading) return <div className="page"><p className="page-subtitle">Loading profile…</p></div>;

  const p = editing ? form : profile;
  const orgs = profile?.organizations || [];

  const ChipDisplay = ({ options, field, single = false }) => (
    <div className="multi-select">
      {options.map(opt => (
        editing
          ? <button key={opt} type="button" className={`chip ${(Array.isArray(form[field]) ? form[field].includes(opt) : form[field] === opt) ? 'chip-active' : ''}`} onClick={() => toggleChip(field, opt, single)}>{opt}</button>
          : <span key={opt} className={`chip ${(Array.isArray(profile[field]) ? profile[field].includes(opt) : profile[field] === opt) ? 'chip-active' : ''}`} style={{ cursor: 'default' }}>{opt}</span>
      ))}
    </div>
  );

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{user?.name}'s Profile</h1>
        {user?.role === 'admin' && <span className="role-badge admin">Admin</span>}
      </div>

      <div className="glass-card glass-card-wide">
        <Section title="Personal">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p className="profile-label">Gender</p>
              {editing
                ? <ChipDisplay options={GENDERS} field="gender" single />
                : <p className="profile-value">{profile.gender}</p>}
            </div>
            <div>
              <p className="profile-label">Age</p>
              {editing
                ? <input type="number" min="1" max="99" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} className="profile-input" style={{ maxWidth: '100px' }} />
                : <p className="profile-value">{profile.age}</p>}
            </div>
          </div>
        </Section>

        <Section title="Personality Type">
          <ChipDisplay options={MBTI} field="personalityType" single />
        </Section>

        <Section title="Budget">
          <ChipDisplay options={BUDGETS} field="budget" />
        </Section>

        <Section title="Hobbies">
          <ChipDisplay options={HOBBIES} field="hobbies" />
        </Section>

        <Section title="Allergies">
          <ChipDisplay options={ALLERGIES} field="allergies" />
        </Section>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {editing ? (
            <>
              <button className="btn-secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>Save Changes</button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setEditing(true)} style={{ width: 'auto', padding: '12px 32px' }}>Edit Profile</button>
          )}
        </div>
      </div>

      {/* Organizations */}
      <div className="glass-card glass-card-wide" style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', letterSpacing: '0.05em' }}>My Organizations</h2>
        {orgs.length === 0
          ? <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>You haven't joined any organizations yet.</p>
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {orgs.map(org => <span key={org._id} className="chip chip-active" style={{ cursor: 'default' }}>{org.name}</span>)}
            </div>
        }
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', marginBottom: '12px' }}>Have an invite code?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text" placeholder="Enter code (e.g. A3F9B2C1)"
              value={orgCode} onChange={e => setOrgCode(e.target.value.toUpperCase())}
              maxLength={8}
              style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', letterSpacing: '0.12em', fontFamily: 'inherit', fontSize: '1rem' }}
            />
            <button className="btn-primary" onClick={handleJoinOrg} disabled={joiningOrg} style={{ width: 'auto', padding: '10px 24px' }}>
              {joiningOrg ? '…' : 'Join'}
            </button>
          </div>
        </div>
        {user?.role !== 'admin' && (
          <p style={{ marginTop: '20px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)' }}>
            Want to create your own organization?{' '}
            <a href="/admin/register" style={{ color: '#7ecfa0' }}>Become an admin</a>
          </p>
        )}
      </div>
    </div>
  );
}
