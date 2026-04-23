import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const NAV = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'create',   label: 'Create Event' },
  { id: 'events',   label: 'View Events' },
  { id: 'org',      label: 'Your Organization' },
];

export default function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('overview');
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Create/Edit event form
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', assignedTo: [] });
  const [editingEvent, setEditingEvent] = useState(null);
  const [savingEvent, setSavingEvent] = useState(false);

  // View details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => { fetchAll(); }, []);

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
      if (eventsRes.ok) setEvents(eventsData.events || []);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleNav = (id) => {
    if (id === 'profile') { navigate('/profile'); return; }
    if (id === 'settings') { navigate('/settings'); return; }
    setActiveView(id);
    setEditingEvent(null);
    setEventForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', assignedTo: [] });
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

  const copyCode = () => {
    navigator.clipboard.writeText(org.inviteCode);
    toast.success('Code copied!');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  const openEditEvent = (ev) => {
    setEditingEvent(ev);
    setEventForm({
      title: ev.title,
      description: ev.description || '',
      date: new Date(ev.date).toISOString().split('T')[0],
      startTime: ev.startTime || '',
      endTime: ev.endTime || '',
      location: ev.location || '',
      assignedTo: ev.assignedTo?.map(u => u._id || u) || [],
    });
    setSelectedEvent(null);
    setActiveView('create');
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
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', assignedTo: [] });
      fetchAll();
      setActiveView('events');
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
      setSelectedEvent(null);
      fetchAll();
    } catch (err) { toast.error(err.message); }
  };

  const toggleAssignee = (id) => {
    setEventForm(f => ({
      ...f,
      assignedTo: f.assignedTo.includes(id) ? f.assignedTo.filter(i => i !== id) : [...f.assignedTo, id],
    }));
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <aside className="dash-sidebar">
          <div className="dash-sidebar-header"><span className="dash-sidebar-title">Account Dashboard</span></div>
        </aside>
        <main className="dash-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}>Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span className="dash-sidebar-label">Account Dashboard</span>
          {org?.name && <span className="dash-sidebar-org">{org.name}</span>}
        </div>

        <nav className="dash-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`dash-nav-item${activeView === item.id ? ' active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="dash-nav-divider" />
          <button className="dash-nav-item" onClick={() => handleNav('profile')}>Profile Information</button>
          <button className="dash-nav-item" onClick={() => handleNav('settings')}>Settings</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="dash-content">
        {activeView === 'overview' && (
          <OverviewView org={org} members={members} events={events} onNav={setActiveView} />
        )}
        {activeView === 'create' && (
          <CreateEventView
            eventForm={eventForm}
            setEventForm={setEventForm}
            editingEvent={editingEvent}
            savingEvent={savingEvent}
            members={members}
            toggleAssignee={toggleAssignee}
            handleSaveEvent={handleSaveEvent}
            onCancel={() => { setEditingEvent(null); setActiveView('events'); }}
          />
        )}
        {activeView === 'events' && (
          <EventsView
            events={events}
            onViewDetails={setSelectedEvent}
            onNewEvent={() => setActiveView('create')}
            formatDate={formatDate}
          />
        )}
        {activeView === 'org' && (
          <OrganizationView
            org={org}
            members={members}
            generating={generating}
            handleGenerateCode={handleGenerateCode}
            copyCode={copyCode}
            formatDate={formatDate}
          />
        )}
      </main>

      {/* View Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <div className="modal-date-badge">{formatDate(selectedEvent.date)}</div>
            <h2 className="modal-title">{selectedEvent.title}</h2>
            {selectedEvent.startTime && (
              <p className="modal-meta">⏰ {selectedEvent.startTime}{selectedEvent.endTime ? ` — ${selectedEvent.endTime}` : ''}</p>
            )}
            {selectedEvent.location && <p className="modal-meta">📍 {selectedEvent.location}</p>}
            <p className="modal-meta">👥 {selectedEvent.assignedTo?.length || 0} assigned</p>
            {selectedEvent.description && (
              <p className="modal-description">{selectedEvent.description}</p>
            )}
            <div className="modal-actions">
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => openEditEvent(selectedEvent)}>Edit</button>
              <button className="btn-delete" style={{ flex: 1 }} onClick={() => handleDeleteEvent(selectedEvent._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-views ----

function OverviewView({ org, members, events, onNav }) {
  return (
    <div className="dash-view">
      <h1 className="dash-view-title">Dashboard</h1>
      <p className="dash-view-subtitle">Welcome back. Here's a summary of your organization.</p>

      <div className="dash-stat-cards">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Total Events Hosted</span>
          <span className="dash-stat-value">{events.length}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Members</span>
          <span className="dash-stat-value">{members.length}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Organization Code</span>
          <span className="dash-stat-value-mono">
            {org?.inviteCode && org?.isInviteValid ? org.inviteCode : '—'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => onNav('create')}>
          + Create Event
        </button>
        <button className="btn-secondary" style={{ padding: '10px 24px' }} onClick={() => onNav('events')}>
          View Events
        </button>
      </div>
    </div>
  );
}

function CreateEventView({ eventForm, setEventForm, editingEvent, savingEvent, members, toggleAssignee, handleSaveEvent, onCancel }) {
  const set = (key) => (e) => setEventForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="dash-view">
      <h1 className="dash-view-title">{editingEvent ? 'Edit Event' : 'Create Event'}</h1>
      <p className="dash-view-subtitle">{editingEvent ? 'Update the details below.' : 'Fill in the details to create a new event for your organization.'}</p>

      <div className="dash-form-card">
        <div className="form-group">
          <label>Name of the Event *</label>
          <input type="text" placeholder="Event title" value={eventForm.title} onChange={set('title')} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="What's this event about?"
            value={eventForm.description}
            onChange={set('description')}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input type="date" value={eventForm.date} onChange={set('date')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>Start Time</label>
            <input type="text" placeholder="e.g. 6:00 PM" value={eventForm.startTime} onChange={set('startTime')} />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="text" placeholder="e.g. 9:00 PM" value={eventForm.endTime} onChange={set('endTime')} />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" placeholder="Where is this event?" value={eventForm.location} onChange={set('location')} />
        </div>

        {members.length > 0 && (
          <div className="form-group">
            <label>Invite Organization Members</label>
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
          {editingEvent && (
            <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          )}
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSaveEvent} disabled={savingEvent}>
            {savingEvent ? 'Saving…' : editingEvent ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

function EventsView({ events, onViewDetails, onNewEvent, formatDate }) {
  return (
    <div className="dash-view">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="dash-view-title" style={{ marginBottom: '4px' }}>Events</h1>
          <p className="dash-view-subtitle" style={{ marginBottom: 0 }}>{events.length} event{events.length !== 1 ? 's' : ''} in your organization</p>
        </div>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 22px' }} onClick={onNewEvent}>+ New Event</button>
      </div>

      {events.length === 0 ? (
        <div className="dash-form-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p className="dash-empty">No events yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="dash-events-table">
          <div className="dash-events-header">
            <span>Event</span>
            <span>Date</span>
            <span>Location</span>
            <span>Assigned</span>
            <span></span>
          </div>
          {events.map(ev => (
            <div className="dash-events-row" key={ev._id}>
              <div>
                <div className="dash-events-title">{ev.title}</div>
                {ev.description && <div className="dash-events-desc">{ev.description}</div>}
              </div>
              <span className="dash-events-meta">{formatDate(ev.date)}</span>
              <span className="dash-events-meta">{ev.location || '—'}</span>
              <span className="dash-events-meta">{ev.assignedTo?.length || 0} members</span>
              <button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }} onClick={() => onViewDetails(ev)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrganizationView({ org, members, generating, handleGenerateCode, copyCode, formatDate }) {
  return (
    <div className="dash-view">
      <h1 className="dash-view-title">Your Organization</h1>
      {org?.name && <p className="dash-view-subtitle">{org.name}</p>}

      {/* Invite Code */}
      <div className="dash-form-card" style={{ marginBottom: '24px' }}>
        <h2 className="dash-section-title">Invite Code</h2>
        {org?.inviteCode && org?.isInviteValid ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div className="invite-code-display">{org.inviteCode}</div>
              <button className="btn-secondary" onClick={copyCode}>Copy</button>
            </div>
            <p className="dash-hint">Expires: {formatDate(org.inviteCodeExpiry)}</p>
          </>
        ) : (
          <p className="dash-empty" style={{ marginBottom: '8px' }}>
            {org?.inviteCode ? 'Your invite code has expired.' : 'No active invite code.'}
          </p>
        )}
        <button className="btn-primary" onClick={handleGenerateCode} disabled={generating} style={{ marginTop: '14px', width: 'auto', padding: '10px 24px' }}>
          {generating ? 'Generating…' : org?.inviteCode ? 'Generate New Code' : 'Generate Invite Code'}
        </button>
        <p className="dash-hint">Valid for 3 days.</p>
      </div>

      {/* Members */}
      <div className="dash-form-card">
        <h2 className="dash-section-title">Members ({members.length})</h2>
        {members.length === 0 ? (
          <p className="dash-empty">No members yet. Share your invite code to get started.</p>
        ) : (
          <div className="members-table">
            <div className="members-table-header"><span>#</span><span>Name</span><span>Email</span></div>
            {members.map((m, i) => (
              <div className="members-table-row" key={m._id}>
                <span className="member-index">{i + 1}</span>
                <span>{m.name}</span>
                <span className="member-email">{m.email}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
