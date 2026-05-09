import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroStack from '../components/HeroStack';

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const firstName = user?.name?.split(' ')[0];

  useEffect(() => {
    document.body.classList.add('body-on-dark');
    const prev = document.body.style.cssText;
    document.body.style.background = `
      radial-gradient(ellipse 70% 80% at 18% 22%, var(--primary) 0%, transparent 55%),
      radial-gradient(ellipse 60% 70% at 82% 28%, var(--accent) 0%, transparent 50%),
      radial-gradient(ellipse 75% 65% at 70% 90%, var(--primary-dark) 0%, transparent 55%),
      radial-gradient(ellipse 55% 60% at 12% 88%, var(--primary-dark) 0%, transparent 60%),
      var(--primary-dark)
    `;
    document.body.style.backgroundAttachment = 'fixed';
    return () => {
      document.body.classList.remove('body-on-dark');
      document.body.style.cssText = prev;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      requestAnimationFrame(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  useEffect(() => {
    const hero = document.querySelector('.hero-v2');
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('nav-scrolled', !entry.isIntersecting);
      },
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      document.body.classList.remove('nav-scrolled');
    };
  }, []);

  return (
    <div className="home-v2" style={{ background: 'transparent' }}>
      <style>{`
        .home-v2 .hero-stack-card,
        .home-v2 .hero-stack-group { box-shadow: none; }

        /* Take the nav out of layout flow on the home page so the hero
           can span 0 → 100vh and its centered contents land at true viewport center.
           !important is needed because Navbar sets position:relative inline. */
        body.body-on-dark .nav-on-dark.nav-wrap {
          position: fixed !important;
          top: 0;
          left: 0;
          right: 0;
        }

        /* Constrain the hero so flex content can't overflow past 100vh. */
        .home-v2 .hero-v2 {
          min-height: 0;
          overflow: hidden;
        }
        .home-v2 .hero-v2 .hero-v2-left,
        .home-v2 .hero-v2 .hero-v2-right { flex: 0 0 auto; }

        .home-v2 .hero-v2-left .hero-v2-ctas { margin-top: 12px; }

        .home-v2 .how-v3-row .mock-card {
          transition: transform 0.35s ease;
        }
        .home-v2 .how-v3-row .mock-card:hover { transform: rotate(-2deg); }
        .home-v2 .how-v3-row.how-v3-row-reverse .mock-card:hover { transform: rotate(2deg); }

        .page-grain {
          position: fixed;
          inset: -12%;
          width: 124%;
          height: 124%;
          z-index: -1;
          pointer-events: none;
          opacity: 0.45;
          display: block;
          mix-blend-mode: overlay;
          animation: grain-shift 1.5s steps(8) infinite;
          will-change: transform;
        }
        @keyframes grain-shift {
          0%   { transform: translate3d(0, 0, 0); }
          10%  { transform: translate3d(-5%, -5%, 0); }
          20%  { transform: translate3d(3%, 4%, 0); }
          30%  { transform: translate3d(-4%, 1%, 0); }
          40%  { transform: translate3d(5%, -3%, 0); }
          50%  { transform: translate3d(-2%, 5%, 0); }
          60%  { transform: translate3d(4%, -1%, 0); }
          70%  { transform: translate3d(-3%, -4%, 0); }
          80%  { transform: translate3d(1%, 2%, 0); }
          90%  { transform: translate3d(-5%, -3%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-grain { animation: none; }
        }
      `}</style>
      <svg className="page-grain" aria-hidden="true" preserveAspectRatio="none">
        <filter id="page-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#page-grain-filter)" />
      </svg>
      <div>
      <section className="hero-v2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 'none', padding: 0, gap: 80, background: 'transparent', height: '100vh' }}>
        <div className="hero-v2-left" style={{ padding: '0 56px', marginBottom: 0, gap: 20 }}>
          {/* <span className="hero-eyebrow">For student orgs &amp; small communities</span> */}
          <h1 className="hero-v2-title" style={{ fontSize: '3rem' }}>
            Your <em>autopilot</em> for <br />
            community building.
          </h1>
          <p className="hero-v2-sub">
            Coordinating group meetups based on shared vibes
            to build a tight-knit community for your organization.
          </p>
          <div className="hero-v2-ctas">
            <Link to={isLoggedIn ? '/calendar' : '/login?tab=register'} className="btn-pill">
              {isLoggedIn ? 'Go to my calendar' : 'Take your seat'}
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className="hero-v2-right" style={{ aspectRatio: 'auto', width: '100%', paddingBottom: 0 }}>
          <HeroStack />
        </div>
      </section>
      </div>

      <div style={{ background: 'var(--bg)' }}>
      <section id="how-it-works" className="how-v3">
        {/* <p className="how-v3-eyebrow">How Seatd works</p> */}

        <div className="how-v3-row">
          <div className="how-v3-text">
            {/* <span className="how-v3-step-eyebrow">01 · Your Profile</span> */}
            <h3 className="how-v3-headline">A profile with your vibe.</h3>
            <p className="how-v3-body">
              We ask about your preferences and what you're up for. Your profile helps
              us find the right people to connect you with and the logistics ahead.
            </p>
          </div>
          <div className="how-v3-visual">
            <div className="mock-card">
              <div>
                <span className="mock-label">Profile</span>
                <div className="mock-name" style={{ marginTop: 4 }}>Jordan Lee</div>
              </div>
              <div className="mock-section">
                <span className="mock-section-label">Hobbies</span>
                <div className="mock-chips">
                  <span className="mock-chip mock-chip-active">Hiking</span>
                  <span className="mock-chip mock-chip-active">Coffee</span>
                  <span className="mock-chip mock-chip-active">Board Games</span>
                  <span className="mock-chip">Music</span>
                  <span className="mock-chip">Cooking</span>
                  <span className="mock-chip">Running</span>
                </div>
              </div>
              <div className="mock-section">
                <span className="mock-section-label">MBTI</span>
                <div className="mock-chips">
                  <span className="mock-chip">INTJ</span>
                  <span className="mock-chip">INFP</span>
                  <span className="mock-chip mock-chip-active">ENFP</span>
                  <span className="mock-chip">ESTJ</span>
                </div>
              </div>
              <div className="mock-section">
                <span className="mock-section-label">Budget</span>
                <div className="mock-chips">
                  <span className="mock-chip">$</span>
                  <span className="mock-chip mock-chip-active">$$</span>
                  <span className="mock-chip">$$$</span>
                  <span className="mock-chip">$$$$</span>
                </div>
              </div>
              <div className="mock-section">
                <span className="mock-section-label">Dietary</span>
                <div className="mock-chips">
                  <span className="mock-chip mock-chip-active">Vegetarian</span>
                  <span className="mock-chip">Vegan</span>
                  <span className="mock-chip">Gluten-free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="how-v3-row how-v3-row-reverse">
          <div className="how-v3-text">
            {/* <span className="how-v3-step-eyebrow">02 · For Admins</span> */}
            <h3 className="how-v3-headline">One form. That's it!</h3>
            <p className="how-v3-body">
              We'll help your org decide a time, place, and group size for your next event.
            </p>
          </div>
          <div className="how-v3-visual">
            <div className="mock-card">
              <div>
                <span className="mock-label">New Event</span>
                <div className="mock-name" style={{ marginTop: 4 }}>Plan a gathering</div>
              </div>
              <div className="mock-form-group">
                <span className="mock-section-label">Title</span>
                <div className="mock-input">Coffee &amp; Catch-up</div>
              </div>
              <div className="mock-row">
                <div className="mock-form-group">
                  <span className="mock-section-label">Date</span>
                  <div className="mock-input">Fri, Apr 24</div>
                </div>
                <div className="mock-form-group">
                  <span className="mock-section-label">Time</span>
                  <div className="mock-input">7:00 PM</div>
                </div>
              </div>
              <div className="mock-form-group">
                <span className="mock-section-label">Location</span>
                <div className="mock-input">Victrola Coffee</div>
              </div>
              <div className="mock-form-group">
                <span className="mock-section-label">Group Size</span>
                <div className="mock-size-pills">
                  <span className="mock-size-pill">2</span>
                  <span className="mock-size-pill">3</span>
                  <span className="mock-size-pill mock-size-pill-active">4</span>
                  <span className="mock-size-pill">5</span>
                  <span className="mock-size-pill">6</span>
                </div>
              </div>
              <div className="mock-btn-primary">Generate groups</div>
            </div>
          </div>
        </div>

        <div className="how-v3-row">
          <div className="how-v3-text">
            {/* <span className="how-v3-step-eyebrow">03 · What You See</span> */}
            <h3 className="how-v3-headline">Mix and match.</h3>
            <p className="how-v3-body">
              Get ready to find out who you've been matched with, you won't know your seat until the reveal.
              Each person then sees their seat, who they're with, and what the group has in common. Have fun!
            </p>
          </div>
          <div className="how-v3-visual">
            <div className="mock-card">
              <div className="mock-event-header">
                <span className="mock-label">Fri · Apr 24 · 7:00 PM</span>
                <div className="mock-name">Coffee &amp; Catch-up</div>
              </div>
              <div className="mock-group-card">
                <span className="mock-group-label">Group 01</span>
                <span className="mock-group-names">Alice, Bob, Charlie</span>
                <span className="mock-group-shared">3 shared · Hiking · Coffee · Board Games</span>
              </div>
              <div className="mock-group-card">
                <span className="mock-group-label">Group 02</span>
                <span className="mock-group-names">Dana, Eli, Farah</span>
                <span className="mock-group-shared">2 shared · Music · Cooking</span>
              </div>
              <div className="mock-group-card">
                <span className="mock-group-label">Group 03</span>
                <span className="mock-group-names">Gwen, Harper, Ivan, Jules</span>
                <span className="mock-group-shared">3 shared · Running · Coffee · Hiking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      <div style={{ background: 'var(--bg)' }}>
      <section className="home-cta">
        <div className="home-cta-card">
          {isLoggedIn ? (
            <>
              <h2 className="home-cta-title">Welcome back, {firstName}.</h2>
              <p className="home-cta-desc">Your next gathering is one click away.</p>
              <Link to="/calendar" className="home-cta-btn">
                View my calendar <ArrowRight />
              </Link>
            </>
          ) : (
            <>
              <h2 className="home-cta-title">Ready to take your seat?</h2>
              <p className="home-cta-desc">
                Register your org or join an existing one with an invite code. We promise the whole thing takes about a minute!
              </p>
              <Link to="/login?tab=register" className="home-cta-btn">
                Take your seat <ArrowRight />
              </Link>
            </>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
