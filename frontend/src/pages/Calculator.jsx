import { useState } from 'react';

const PRICE_PER_OZ = 15.15 / 128;
const CONCENTRATION = 150;

function calcCost(sqft) {
  return (sqft / CONCENTRATION) * PRICE_PER_OZ;
}

export default function Calculator() {
  const [fieldArea, setFieldArea] = useState('');
  const [weedArea, setWeedArea] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const field = parseFloat(fieldArea);
    const weed = parseFloat(weedArea);
    if (isNaN(field) || isNaN(weed) || field <= 0 || weed <= 0 || weed > field) {
      alert('Please enter valid areas. Weed area cannot exceed field area.');
      return;
    }
    const fullCost = calcCost(field);
    const weedCost = calcCost(weed);
    setResults({ fullCost, weedCost, saved: fullCost - weedCost });
  };

  return (
    <div className="page">
      <h1 className="page-title">Green Solution Calculator</h1>
      <p className="page-subtitle">
        Cut costs and reduce environmental impact by applying herbicide only where needed.
        Prices calculated using a 2% concentration of Monsanto Roundup PowerMAX® 3.
      </p>
      <div className="glass-card glass-card-wide">
        <div className="info-box">
          Application of herbicide to an entire field is both environmentally unsustainable and
          costly. Enter your field and weed areas below to see how much you can save.
        </div>
        <div className="calc-row">
          <div className="form-group">
            <label>Estimated Field Area (ft²)</label>
            <input type="number" placeholder="e.g. 50000" value={fieldArea} onChange={e => setFieldArea(e.target.value)} min="0" />
          </div>
          <div className="form-group">
            <label>Estimated Weed Area (ft²)</label>
            <input type="number" placeholder="e.g. 8000" value={weedArea} onChange={e => setWeedArea(e.target.value)} min="0" />
          </div>
        </div>
        <button className="btn-primary" onClick={handleCalculate}>Calculate Savings</button>
        {results && (
          <>
            <div className="calc-row" style={{ marginTop: '28px', marginBottom: 0 }}>
              <div className="result-box">
                <h3>Full Field Cost</h3>
                <div className="result-value">${results.fullCost.toFixed(4)}</div>
              </div>
              <div className="result-box">
                <h3>Weeded Areas Only</h3>
                <div className="result-value">${results.weedCost.toFixed(4)}</div>
              </div>
            </div>
            <div className="savings-banner">
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>Total Saved</span>
              <span style={{ fontSize: '2rem', color: '#7ecfa0' }}>${results.saved.toFixed(4)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
