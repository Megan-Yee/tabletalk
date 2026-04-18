import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState('members'); // 'members' | 'events'
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', assignedTo: [] });
  const [savingEvent, setSavingEvent] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [membersRes, eventsRes] = await Promise.all([
        fetch(`${API}/org/members`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/events/org-events`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const membersData = await membersRes.json();
      const eventsData = await eventsRes.json();
      if (!membersRes.ok) throw new Error(membersData.msg);
      setOrg(membersData.org);
      setMembers(membersData.members);
      if (eventsRes.ok) setEvents(eventsData.events);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API}/org/generate-code`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success('New invite code generated!');
      fetchAll();
    } catch (err) { toast.error(err.message); }
    finally { setGenerating(false); }
  };

  const copyCode = () => { navigator.clipboard.writeText(org.inviteCode); toast.success('Code copied!'); };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  const openNewEvent = () => {
    setEditingEvent(null);
    setEventForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', assignedTo: [] });
    setShowEventForm(true);
  };

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      title: ev.title, description: ev.description,
      date: new Date(ev.date).toISOString().split('T')[0],
      startTime: ev.startTime, endTime: ev.endTime, location: ev.location,
      assignedTo: ev.assignedTo.map(u => u._id || u),
    });
    setShowEventForm(true);
  };

  const toggleAssignee = (id) => {
    setEventForm(f => ({
      ...f,
      assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter(i => i !== id) : [...f.assignedTo, id],
    }));
  };

  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.date) { toast.error('Title and date are required'); return; }
    setSavingEvent(true);
    try {
      const url = editingEvent ? `${API}/events/${editingEvent._id}` : `${API}/events`;
      const method = editingEvent ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success(editingEvent ? 'Event updated!' : 'Event created!');
      setShowEventForm(false);
      fetchAll();
    } catch (err) { toast.error(err.message); }
    finally { setSavingEvent(false); }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await fetch(`${API}/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      toast.success('Event deleted');
      fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <div className="page"><p className="page-subtitle">Loading dashboard…</p></div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{org?.name}</h1>
        <span className="role-badge admin">Admin</span>
      </div>
      <p className="page-subtitle">Manage your organization, members, and events.</p>

      {/* Invite Code */}
      <div className="glass-card glass-card-wide" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Invite Code</h2>
        {org?.inviteCode && org?.isInviteValid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div className="invite-code-display">{org.inviteCode}</div>
              <button className="btn-secondary" onClick={copyCode}>Copy</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>Expires: {formatDate(org.inviteCodeExpiry)}</p>
          </>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
            {org?.inviteCode ? 'Your invite code has expired.' : 'No active invite code.'}
          </p>
        )}
        <button className="btn-primary" onClick={handleGenerateCode} disabled={generating} style={{ marginTop: '14px', width: 'auto', padding: '10px 24px' }}>
          {generating ? 'Generating…' : org?.inviteCode ? 'Generate New Code' : 'Generate Invite Code'}
        </button>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginTop: '6px' }}>Valid for 3 days.</p>
      </div>

      {/* Tab switcher */}
      <div className="tab-bar" style={{ marginBottom: '20px' }}>
        <button className={`tab-btn ${tab === 'members' ? 'tab-btn-active' : ''}`} onClick={() => setTab('members')}>
          Members ({members.length})
        </button>
        <button className={`tab-btn ${tab === 'events' ? 'tab-btn-active' : ''}`} onClick={() => setTab('events')}>
          Events ({events.length})
        </button>
      </div>

      {/* Members tab */}
      {tab === 'members' && (
        <div className="glass-card glass-card-wide">
          {members.length === 0
            ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>No members yet.</p>
            : (
              <div className="members-table">
                <div className="members-table-header"><span>#</span><span>Name</span><span>Email</span></div>
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
      )}

      {/* Events tab */}
      {tab === 'events' && (
        <div className="glass-card glass-card-wide">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Organization Events</h2>
            <button className="btn-primary" onClick={openNewEvent} style={{ width: 'auto', padding: '10px 22px' }}>+ New Event</button>
          </div>

          {events.length === 0
            ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>No events yet. Create one to assign to members.</p>
            : events.map(ev => {
                const d = new Date(ev.date);
                return (
                  <div key={ev._id} className="admin-event-row">
                    <div className="admin-event-date">
                      <span>{MONTHS[d.getMonth()]}</span>
                      <strong>{d.getDate()}</strong>
                    </div>
                    <div className="admin-event-info">
                      <div className="admin-event-title">{ev.title}</div>
                      <div className="admin-event-meta">
                        {ev.startTime && <span>🕐 {ev.startTime}{ev.endTime ? ` — ${ev.endTime}` : ''}</span>}
                        {ev.location && <span>📍 {ev.location}</span>}
                        <span>👥 {ev.assignedTo?.length || 0} assigned</span>
                      </div>
                    </div>
                    <div className="admin-event-actions">
                      <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }} onClick={() => openEditEvent(ev)}>Edit</button>
                      <button onClick={() => handleDeleteEvent(ev._id)} style={{ background: 'rgba(180,40,40,0.3)', border: '1px solid rgba(200,60,60,0.4)', borderRadius: '8px', color: '#ff9999', padding: '6px 14px', fontSize: '0.9rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="modal-overlay" onClick={() => setShowEventForm(false)}>
          <div className="modal-card" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEventForm(false)}>✕</button>
            <h2 className="modal-title" style={{ marginBottom: '24px' }}>
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h2>

            <div className="form-group">
              <label>Title *</label>
              <input type="text" placeholder="Event title" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Start Time</label>
                <input type="text" placeholder="e.g. 10:00 AM" value={eventForm.startTime} onChange={e => setEventForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="text" placeholder="e.g. 12:00 PM" value={eventForm.endTime} onChange={e => setEventForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="Where is this event?" value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Optional details…"
                value={eventForm.description}
                onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontFamily: 'inherit', fontSize: '1rem', minHeight: '80px', resize: 'vertical' }}
              />
            </div>

            {members.length > 0 && (
              <div className="form-group">
                <label>Assign To</label>
                <div className="multi-select" style={{ marginTop: '8px' }}>
                  {members.map(m => (
                    <button
                      key={m._id} type="button"
                      className={`chip ${eventForm.assignedTo.includes(m._id) ? 'chip-active' : ''}`}
                      onClick={() => toggleAssignee(m._id)}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-secondary" onClick={() => setShowEventForm(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveEvent} disabled={savingEvent} style={{ flex: 2 }}>
                {savingEvent ? 'Saving…' : editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
