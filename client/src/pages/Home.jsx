import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E' }}>

      {/* Nav */}
      <nav className="nav" style={{
        background: 'rgba(15,10,30,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Logo size={30} />
        <Link to="/login" className="dark-nav-btn" style={{
          padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          border: '1.5px solid rgba(167,139,250,0.4)', color: '#A78BFA',
          textDecoration: 'none', background: 'rgba(167,139,250,0.08)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <span className="nav-btn-short" style={{ display: 'none' }}>Login</span>
          <span className="nav-btn-full">Approver Login →</span>
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', padding: '100px 24px 70px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Grid pattern */}
        <div className="grid-overlay" />

        {/* Glow blobs */}
        <div className="blob" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', top: -200, right: -100, filter: 'blur(40px)' }} />
        <div className="blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)', bottom: -100, left: -80, filter: 'blur(40px)' }} />
        <div className="blob" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%)', top: 80, left: '25%', filter: 'blur(40px)' }} />

        {/* Floating emoji decorations */}
        <div className="float-slow" style={{ position: 'absolute', top: 130, left: '12%', fontSize: 34, opacity: 0.5, pointerEvents: 'none' }}>🤖</div>
        <div className="float-slow" style={{ position: 'absolute', top: 220, right: '10%', fontSize: 30, opacity: 0.45, pointerEvents: 'none', animationDelay: '-2s' }}>☁️</div>
        <div className="float-slow" style={{ position: 'absolute', bottom: 110, left: '20%', fontSize: 26, opacity: 0.4, pointerEvents: 'none', animationDelay: '-3.5s' }}>✨</div>
        <div className="float-slow" style={{ position: 'absolute', bottom: 170, right: '18%', fontSize: 28, opacity: 0.4, pointerEvents: 'none', animationDelay: '-1s' }}>⚡</div>

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
          <div className="fade-up glow-pulse" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 30,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
            fontSize: 13, fontWeight: 600, color: '#C4B5FD',
          }}>
            🚀 Django Internal Tool Portal
          </div>

          {/* Headline */}
          <h1 className="hero-title fade-up-1" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em', color: 'white' }}>
            Request AI &{' '}
            <span className="gradient-anim">SaaS Tools</span>
            <br />the smart way
          </h1>

          <p className="fade-up-2" style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 44px' }}>
            Submit tool requests for your team. HR reviews, the director approves. Simple, fast, transparent.
          </p>

          {/* CTAs */}
          <div className="hero-btns fade-up-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/submit" className="hero-btn-primary" style={{
              padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: 'linear-gradient(135deg, #6366F1, #A855F7, #EC4899)',
              color: 'white', textDecoration: 'none',
              boxShadow: '0 0 30px rgba(139,92,246,0.5)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              📝 Submit a Request
            </Link>
            <Link to="/login" className="hero-btn-outline" style={{
              padding: '14px 32px', borderRadius: 14, fontWeight: 700, fontSize: 16,
              background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)',
              color: 'white', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              🔐 Approver Login
            </Link>
          </div>

          {/* Stat chips */}
          <div className="fade-up-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 52 }}>
            <span className="stat-chip">⚡ 2-step approval</span>
            <span className="stat-chip">🏢 14 departments</span>
            <span className="stat-chip">₹ INR budgets</span>
            <span className="stat-chip">📊 Excel exports</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1000, margin: '20px auto 0', padding: '0 24px 80px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
            How it{' '}
            <span style={{ background: 'linear-gradient(135deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              works
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 10, fontSize: 15 }}>Three simple steps from request to approval</p>
        </div>

        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { step: '01', icon: '📝', title: 'Submit', grad: 'linear-gradient(135deg,#6366F1,#8B5CF6)', desc: 'Fill in the tool name, department, budget and why your team needs it.' },
            { step: '02', icon: '👥', title: 'HR Reviews', grad: 'linear-gradient(135deg,#8B5CF6,#C026D3)', desc: 'HR checks it for policy fit and passes it to the director.' },
            { step: '03', icon: '✅', title: 'Director Approves', grad: 'linear-gradient(135deg,#C026D3,#EC4899)', desc: 'Final sign-off is given. The tool can be purchased right away.' },
          ].map(s => (
            <div key={s.step} className="dark-card" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 28, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.grad, borderRadius: '20px 20px 0 0' }} />
              <div style={{ width: 52, height: 52, borderRadius: 16, background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18, boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(167,139,250,0.7)', letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: 'white' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why teams love it */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 90px', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', top: 0, left: '30%', pointerEvents: 'none', filter: 'blur(40px)' }} />

        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
            Built for{' '}
            <span style={{ background: 'linear-gradient(135deg,#38BDF8,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              speed
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 10, fontSize: 15 }}>Everything your team needs to keep tool spending in check</p>
        </div>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[
            { icon: '📊', title: 'One-click Excel exports', grad: 'linear-gradient(135deg,#10B981,#059669)', desc: 'Download every request, decision and budget to a spreadsheet for finance — instantly.' },
            { icon: '🔍', title: 'Full transparency', grad: 'linear-gradient(135deg,#38BDF8,#0891B2)', desc: 'See exactly where every request sits — pending HR, with the director, approved or rejected.' },
            { icon: '🤖', title: 'AI & SaaS tracking', grad: 'linear-gradient(135deg,#A78BFA,#7C3AED)', desc: 'Requests are tagged as AI subscriptions or SaaS software so spend is easy to categorize.' },
            { icon: '🔐', title: 'Role-based access', grad: 'linear-gradient(135deg,#F472B6,#EC4899)', desc: 'HR and the director each get their own secure dashboard. Employees never need a login.' },
          ].map(f => (
            <div key={f.title} className="dark-card" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20, padding: 28, display: 'flex', gap: 18, alignItems: 'flex-start',
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: f.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 8px 20px rgba(99,102,241,0.25)' }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 7, color: 'white' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div style={{ marginBottom: 10 }}><Logo size={22} /></div>
        <div>Internal AI & SaaS approval portal</div>
        <div style={{ marginTop: 8 }}>
          <Link to="/submit">Submit a request</Link>
          <span style={{ margin: '0 10px', opacity: 0.3 }}>·</span>
          <Link to="/login">Approver login</Link>
        </div>
      </footer>
    </div>
  );
}
