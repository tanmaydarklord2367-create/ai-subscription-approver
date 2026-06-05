import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="nav">
        <span className="nav-logo">🤖 AI Approver</span>
        <Link to="/login" className="btn btn-outline btn-sm">Approver Login</Link>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--primary-light)', color: 'var(--primary)',
          padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, marginBottom: 24,
        }}>
          ✦ AI Tool Request Portal
        </div>

        <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 20 }}>
          Request AI tools for{' '}
          <span style={{ color: 'var(--primary)' }}>your team</span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
          Submit a request for any AI tool or SaaS subscription. HR reviews it first, then the director gives final approval.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/submit" className="btn btn-primary btn-lg">
            📝 Submit a Request
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            🔐 Approver Login
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, marginBottom: 32, color: 'var(--text-primary)' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="grid-2">
          {[
            {
              step: '01', icon: '📝', title: 'Submit a Request',
              desc: 'Fill out the form with the tool name, budget, department, and why your team needs it.',
            },
            {
              step: '02', icon: '👥', title: 'HR Reviews',
              desc: 'HR checks the request for policy compliance and budget fit, then passes it along.',
            },
            {
              step: '03', icon: '✅', title: 'Director Approves',
              desc: "The director gives final sign-off. Approved tools can be purchased right away.",
            },
          ].map(s => (
            <div key={s.step} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 1, marginBottom: 12, opacity: 0.7 }}>
                STEP {s.step}
              </div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
