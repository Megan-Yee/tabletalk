import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="page">
      <h1 className="page-title">Welcome to Seatd</h1>
      <div className="glass-card glass-card-wide">
        <div className="info-box">
          Each year, farmers apply herbicide to their crops to eliminate common weeds. Yet, excess
          herbicide application leads to increased amounts of glyphosate in groundwater, which can
          wreak havoc on the environment.
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          With our <Link to="/calculator" style={{ color: '#7ecfa0' }}>Green Solution Calculator</Link>,
          farmers can reduce their usage of harmful herbicides such as RoundUp by only targeting
          affected areas. Our calculator automatically calculates the amount of herbicide you need
          and provides a simple cost analysis so you can see how much you'll save.
        </p>
      </div>
    </div>
  );
}
