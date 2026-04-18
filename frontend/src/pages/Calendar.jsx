import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatTime(t) { return t || ''; }

function EventCard({ event, onClick }) {
  const d = new Date(event.date);
  return (
    <div className="event-card" onClick={() => onClick(event)}>
      <div className="event-card-date">
        <span className="event-card-month">{MONTHS[d.getMonth()].slice(0,3).toUpperCase()}</span>
        <span className="event-card-day">{d.getDate()}</span>
      </div>
      <div className="event-card-info">
        <div className="event-card-title">{event.title}</div>
        {(event.startTime || event.endTime) && (
          <div className="event-card-time">
            {formatTime(event.startTime)}{event.endTime ? ` — ${formatTime(event.endTime)}` : ''}
          </div>
        )}
        {event.location && <div className="event-card-location">📍 {event.location}</div>}
        {event.organization && <div className="event-card-org">{event.organization.name}</div>}
      </div>
    </div>
  );
}

function EventModal({ event, onClose }) {
  if (!event) return null;
  const d = new Date(event.date);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-date-badge">
          {MONTHS[d.getMonth()]} {d.getDate()}, {d.getFullYear()}
        </div>
        <h2 className="modal-title">{event.title}</h2>
        {(event.startTime || event.endTime) && (
          <div className="modal-meta">
            🕐 {formatTime(event.startTime)}{event.endTime ? ` — ${formatTime(event.endTime)}` : ''}
          </div>
        )}
        {event.location && <div className="modal-meta">📍 {event.location}</div>}
        {event.organization && <div className="modal-meta">🏢 {event.organization.name}</div>}
        {event.createdBy && <div className="modal-meta">👤 Assigned by {event.createdBy.name}</div>}
        {event.description && <p className="modal-description">{event.description}</p>}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month'); // 'month' | 'list'
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/events/my-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      setEvents(data.events);
    } catch (err) {
      toast.error('Could not load events');
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (cells.length % 7 !== 0) cells.push(null);

  const eventsOnDay = (day) => {
    if (!day) return [];
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  };

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  // Upcoming events for list view
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date(today.setHours(0,0,0,0)));
  const pastEvents = events.filter(e => new Date(e.date) < new Date(today.setHours(0,0,0,0)));

  if (loading) return <div className="page"><p className="page-subtitle">Loading calendar…</p></div>;

  return (
    <div className="page" style={{ alignItems: 'stretch', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Calendar</h1>
        <div className="view-toggle">
          <button className={`view-btn ${view === 'month' ? 'view-btn-active' : ''}`} onClick={() => setView('month')}>Month</button>
          <button className={`view-btn ${view === 'list' ? 'view-btn-active' : ''}`} onClick={() => setView('list')}>List</button>
        </div>
      </div>

      {events.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem' }}>
            No events assigned to you yet. Check back later!
          </p>
        </div>
      )}

      {/* ── Month View ── */}
      {view === 'month' && (
        <div className="glass-card glass-card-wide" style={{ padding: '28px 24px' }}>
          {/* Month nav */}
          <div className="cal-header">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <h2 className="cal-month-title">{MONTHS[currentMonth]} {currentYear}</h2>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>

          {/* Day labels */}
          <div className="cal-grid-header">
            {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
          </div>

          {/* Calendar cells */}
          <div className="cal-grid">
            {cells.map((day, i) => {
              const dayEvents = eventsOnDay(day);
              return (
                <div key={i} className={`cal-cell ${day ? '' : 'cal-cell-empty'} ${isToday(day) ? 'cal-cell-today' : ''}`}>
                  {day && <span className="cal-cell-num">{day}</span>}
                  {dayEvents.slice(0, 2).map(ev => (
                    <div key={ev._id} className="cal-event-pill" onClick={() => setSelectedEvent(ev)}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="cal-event-more" onClick={() => setSelectedEvent(dayEvents[2])}>
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── List View ── */}
      {view === 'list' && (
        <div style={{ width: '100%' }}>
          {upcomingEvents.length > 0 && (
            <>
              <h3 className="list-section-title">Upcoming</h3>
              {upcomingEvents.map(ev => <EventCard key={ev._id} event={ev} onClick={setSelectedEvent} />)}
            </>
          )}
          {pastEvents.length > 0 && (
            <>
              <h3 className="list-section-title" style={{ marginTop: '32px', opacity: 0.5 }}>Past</h3>
              {pastEvents.map(ev => <EventCard key={ev._id} event={ev} onClick={setSelectedEvent} />)}
            </>
          )}
          {events.length === 0 && (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '20px' }}>No events to show.</p>
          )}
        </div>
      )}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
