import { useState } from 'react';
import { Link } from 'react-router-dom';

const DEPARTMENTS = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Creative & Branding',
  'Digital Marketing',
  'SEO & Content',
  'Social Media',
  'Performance Marketing',
  'Video Production',
  'Analytics & Data',
  'Client Servicing',
  'Business Development',
  'Project Management',
  'HR',
  'Finance & Accounts',
  'Operations',
  'Other',
];

const EMPTY_FORM = {
  employeeName: '',
  employeeEmail: '',
  department: '',
  toolType: 'ai',
  toolName: '',
  toolWebsite: '',
  budgetAmount: '',
  budgetCycle: 'monthly',
  reason: '',
};

export default function Submit() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(data.request);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Make sure the server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
        <nav className="nav">
          <Link to="/" className="nav-logo">🤖 AI Approver</Link>
        </nav>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Request Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
              Your request for <strong>{submitted.toolName}</strong> is now pending HR review.
              You'll be notified once a decision is made.
            </p>
            <div style={{
              background: 'var(--bg)', borderRadius: 'var(--radius)',
              padding: '12px 16px', marginBottom: 28, textAlign: 'left',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 4 }}>REQUEST ID</div>
              <code style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{submitted.id}</code>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => { setSubmitted(null); setForm(EMPTY_FORM); }}>
                Submit Another
              </button>
              <Link className="btn btn-primary" to="/">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="nav">
        <Link to="/" className="nav-logo">🤖 AI Approver</Link>
      </nav>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 24px 60px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>Submit AI Tool Request</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 15 }}>
            Your request will be reviewed by HR, then approved by the director.
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name <span className="req">*</span></label>
                <input
                  className="form-input"
                  value={form.employeeName}
                  onChange={set('employeeName')}
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Work Email <span className="req">*</span></label>
                <input
                  className="form-input"
                  type="email"
                  value={form.employeeEmail}
                  onChange={set('employeeEmail')}
                  placeholder="jane@company.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department <span className="req">*</span></label>
              <select className="form-select" value={form.department} onChange={set('department')} required>
                <option value="">Select your department…</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Subscription Type <span className="req">*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'ai', icon: '🤖', label: 'AI Subscription', desc: 'e.g. ChatGPT, Copilot, Gemini' },
                  { value: 'saas', icon: '☁️', label: 'SaaS Software', desc: 'e.g. Notion, Slack, Figma' },
                ].map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, toolType: t.value }))}
                    style={{
                      padding: '12px 14px',
                      border: `2px solid ${form.toolType === t.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      background: form.toolType === t.value ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: form.toolType === t.value ? 'var(--primary)' : 'var(--text-primary)' }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tool / Application Name <span className="req">*</span></label>
              <input
                className="form-input"
                value={form.toolName}
                onChange={set('toolName')}
                placeholder="e.g. GitHub Copilot, Notion AI, Jasper"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Tool Website{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                className="form-input"
                type="url"
                value={form.toolWebsite}
                onChange={set('toolWebsite')}
                placeholder="https://…"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-2">
              <div className="form-group">
                <label className="form-label">Budget Amount <span className="req">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: 14, pointerEvents: 'none',
                  }}>₹</span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: 24 }}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.budgetAmount}
                    onChange={set('budgetAmount')}
                    placeholder="19.00"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Billing Cycle <span className="req">*</span></label>
                <select className="form-select" value={form.budgetCycle} onChange={set('budgetCycle')}>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Why do you need this tool? <span className="req">*</span></label>
              <textarea
                className="form-textarea"
                value={form.reason}
                onChange={set('reason')}
                placeholder="Describe your use case, expected productivity gains, and why this tool is needed for your work…"
                required
                rows={5}
                maxLength={1000}
              />
              <span className="form-hint">{form.reason.length}/1000 characters</span>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Submitting…' : 'Submit Request →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
