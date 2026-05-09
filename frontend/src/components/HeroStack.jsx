import { Fragment } from 'react';

const TICKER_COPIES = 4;

export default function HeroStack() {
  return (
    <div className="hs-ticker" aria-hidden="true">
      <style>{`
        .hs-ticker {
          overflow: clip;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          contain: layout paint;
        }
        .hs-ticker-track {
          display: flex;
          width: max-content;
          animation: hs-ticker-scroll 12s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .hs-ticker .hero-stack-card {
          position: relative;
          inset: auto;
          width: auto;
          flex: 0 0 220px;
          margin-right: 20px;
          transform: none;
          animation: none;
          opacity: 1;
          transition: transform 0.35s ease;
        }
        .hs-ticker .hero-stack-card:hover { transform: translateY(-10px); }
        @keyframes hs-ticker-scroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-25%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hs-ticker-track { animation: none; }
        }
      `}</style>
      <div className="hs-ticker-track">
        {Array.from({ length: TICKER_COPIES }, (_, i) => i).map(dup => (
          <Fragment key={dup}>
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
          </Fragment>
        ))}
      </div>
    </div>
  );
}
