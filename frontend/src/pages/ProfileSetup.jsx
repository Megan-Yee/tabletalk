import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const MBTI = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const HOBBIES = ['Hiking','Gaming','Cooking','Reading','Traveling','Photography','Music','Art & Drawing','Fitness','Yoga & Meditation','Dancing','Cycling','Swimming','Board Games','Movies & TV','Volunteering','Sports','Gardening','Writing','Coding'];
const ALLERGIES = ['None','Milk','Eggs','Fish','Shellfish','Tree Nuts','Peanuts','Wheat','Soybeans','Sesame'];
const BUDGETS = ['$','$$','$$$','$$$$'];
const GENDERS = ['Male','Female','Non-binary','Prefer not to say','Other'];

function Chips({ options, selected, onChange, single = false }) {
  const toggle = (opt) => {
    if (single) { onChange([opt]); return; }
    onChange(selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt]);
  };
  return (
    <div className="multi-select">
      {options.map(opt => (
        <button key={opt} type="button" className={`chip ${selected.includes(opt) ? 'chip-active' : ''}`} onClick={() => toggle(opt)}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function ProfileSetup() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const TOTAL = 6;

  const [form, setForm] = useState({
    gender: '', age: '', budget: [], personalityType: '', hobbies: [], allergies: [], orgCode: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    if (step === 1 && !form.gender) { toast.error('Please select a gender'); return false; }
    if (step === 2) {
      const a = parseInt(form.age);
      if (!form.age || isNaN(a) || a < 1 || a > 99) { toast.error('Please enter a valid age (1–99)'); return false; }
    }
    if (step === 3 && form.budget.length === 0) { toast.error('Please select at least one budget option'); return false; }
    if (step === 4 && !form.personalityType) { toast.error('Please select your personality type'); return false; }
    return true;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const body = {
        gender: form.gender,
        age: parseInt(form.age),
        budget: form.budget,
        personalityType: form.personalityType,
        hobbies: form.hobbies,
        allergies: form.allergies.length === 0 ? ['None'] : form.allergies,
      };
      if (form.orgCode) body.orgCode = form.orgCode;

      const res = await fetch(`${API}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to save profile');
      toast.success('Profile created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Set Up Your Profile</h1>
      <p className="page-subtitle">Tell us about yourself to personalize your experience.</p>
      <div className="glass-card glass-card-wide">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>
        <p style={{ textAlign: 'right', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginBottom: '28px' }}>
          Step {step} of {TOTAL}
        </p>

        {step === 1 && <>
          <h2 className="step-title">What is your gender?</h2>
          <Chips options={GENDERS} selected={form.gender ? [form.gender] : []} onChange={v => set('gender', v[0])} single />
        </>}

        {step === 2 && <>
          <h2 className="step-title">How old are you?</h2>
          <div className="form-group" style={{ maxWidth: '200px' }}>
            <label>Age</label>
            <input type="number" min="1" max="99" placeholder="e.g. 22" value={form.age} onChange={e => set('age', e.target.value)} />
          </div>
        </>}

        {step === 3 && <>
          <h2 className="step-title">What's your budget range?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '0.95rem' }}>Select all that apply</p>
          <Chips options={BUDGETS} selected={form.budget} onChange={v => set('budget', v)} />
        </>}

        {step === 4 && <>
          <h2 className="step-title">What's your personality type?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '0.95rem' }}>
            Not sure? <a href="https://www.16personalities.com" target="_blank" rel="noreferrer" style={{ color: '#7ecfa0' }}>Take the test</a>
          </p>
          <Chips options={MBTI} selected={form.personalityType ? [form.personalityType] : []} onChange={v => set('personalityType', v[0])} single />
        </>}

        {step === 5 && <>
          <h2 className="step-title">What are your hobbies?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '0.95rem' }}>Select all that apply</p>
          <Chips options={HOBBIES} selected={form.hobbies} onChange={v => set('hobbies', v)} />
        </>}

        {step === 6 && <>
          <h2 className="step-title">Any food allergies?</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontSize: '0.95rem' }}>Select all that apply</p>
          <Chips options={ALLERGIES} selected={form.allergies} onChange={v => set('allergies', v)} />
          <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'rgba(255,255,255,0.75)' }}>
              Have an organization invite code? <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 300 }}>(optional)</span>
            </h3>
            <div className="form-group" style={{ maxWidth: '280px' }}>
              <input
                type="text" placeholder="e.g. A3F9B2C1"
                value={form.orgCode} onChange={e => set('orgCode', e.target.value.toUpperCase())}
                maxLength={8} style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}
              />
            </div>
          </div>
        </>}

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          {step > 1 && <button className="btn-secondary" onClick={back} style={{ flex: 1 }}>Back</button>}
          {step < TOTAL
            ? <button className="btn-primary" onClick={next} style={{ flex: 2 }}>Next</button>
            : <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>{loading ? 'Saving…' : 'Complete Profile'}</button>
          }
        </div>
      </div>
    </div>
  );
}
