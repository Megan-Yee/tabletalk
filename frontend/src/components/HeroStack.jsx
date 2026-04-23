export default function HeroStack() {
  return (
    <div className="hero-stack" aria-hidden="true">
      <div className="hero-stack-card hero-stack-profile">
        <span className="hs-label">Profile</span>
        <span className="hs-name">Jordan L.</span>
        <div className="hs-chips">
          <span className="hs-chip">Hiking</span>
          <span className="hs-chip">Coffee</span>
          <span className="hs-chip">Board Games</span>
          <span className="hs-chip hs-chip-primary">ENFP</span>
          <span className="hs-chip">$$</span>
        </div>
      </div>

      <div className="hero-stack-card hero-stack-event">
        <span className="hs-date">Fri · Apr 24</span>
        <span className="hs-name">Coffee &amp; Catch-up</span>
        <span className="hs-meta">7:00 PM · Victrola</span>
      </div>

      <div className="hero-stack-card hero-stack-group">
        <span className="hs-label">Your Group · 01</span>
        <div className="hs-row">
          <span className="hs-dot" style={{ background: '#C44C00' }} />
          <span className="hs-person">Alice</span>
          <span className="hs-chip">Hiking</span>
        </div>
        <div className="hs-row">
          <span className="hs-dot" style={{ background: '#C4783A' }} />
          <span className="hs-person">Bob</span>
          <span className="hs-chip">Coffee</span>
        </div>
        <div className="hs-row">
          <span className="hs-dot" style={{ background: '#7ecfa0' }} />
          <span className="hs-person">Charlie</span>
          <span className="hs-chip">Board Games</span>
        </div>
      </div>
    </div>
  );
}
