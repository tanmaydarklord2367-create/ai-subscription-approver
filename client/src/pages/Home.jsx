import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <nav className="nav">
        <span className="nav-logo">✦ Django</span>
        <Link to="/login" className="btn btn-outline btn-sm">Approver Login →</Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', padding: '90px 24px 70px', textAlign: 'center' }}>
        {/* Blobs */}
        <div className="blob" style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.15)', top: -150, right: -100 }} />
        <div className="blob" style={{ width: 350, height: 350, background: 'rgba(236,72,153,0.12)', bottom: -80, left: -80 }} />
        <div className="blob" style={{ width: 250, height: 250, background: 'rgba(139,92,246,0.1)', top: 100, left: '20%' }} />

        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          {/* Pill tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 999, marginBottom: 28,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.12))',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: 13, fontWeight: 600, color: 'var(--primary)',
          }}>
            <span style={{ fontSize: 16 }}>🚀</span> Django Internal Tool Portal
          </div>

          <h1 style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, marginBottom: 22, letterSpacing: '-0.02em' }}>
            Request AI &{' '}
            <span className="gradient-text">SaaS Tools</span>
            <br />the smart way
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 42px' }}>
            Submit tool requests for your team. HR reviews them, the director gives final sign-off. Simple, fast, transparent.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/submit" className="btn btn-primary btn-lg">
              📝 Submit a Request
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              🔐 Approver Login
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '10px 24px 90px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>
            How it <span className="gradient-text">works</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 10, fontSize: 15 }}>Three simple steps from request to approval</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="grid-2">
          {[
            { step: '01', icon: '📝', title: 'Submit', color: '#6366F1', bg: '#EEF2FF', desc: 'Fill in the tool name, department, budget, and why your team needs it.' },
            { step: '02', icon: '👥', title: 'HR Reviews', color: '#8B5CF6', bg: '#F5F3FF', desc: 'HR checks the request for policy fit and passes it to the director.' },
            { step: '03', icon: '✅', title: 'Director Approves', color: '#EC4899', bg: '#FDF2F8', desc: "Final sign-off is given. The tool can be purchased right away." },
          ].map((s, i) => (
            <div key={s.step} className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
              {/* Accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${s.color}, ${i === 2 ? '#F472B6' : '#A78BFA'})`, borderRadius: '14px 14px 0 0' }} />
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: s.bg, fontSize: 22, marginBottom: 16, marginTop: 8 }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
