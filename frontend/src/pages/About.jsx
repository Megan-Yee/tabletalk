export default function About() {
  const team = [
    { name: 'Team Member', role: 'Role', emoji: '🌿' },
    { name: 'Team Member', role: 'Role', emoji: '🌱' },
    { name: 'Team Member', role: 'Role', emoji: '🍃' },
  ];
  return (
    <div className="page">
      <h1 className="page-title">About Us</h1>
      <div className="glass-card glass-card-wide" style={{ marginBottom: '32px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          Insert about us text here.
        </p>
      </div>
      <h2 className="page-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Meet Our Team</h2>
      <div className="team-grid">
        {team.map((member, i) => (
          <div className="team-card" key={i}>
            <div className="avatar">{member.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>{member.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
