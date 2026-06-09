import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E' }}>

      {/* Nav */}
      <nav style={{
        padding: '0 32px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,10,30,0.85)', backdropFilter: 'blur(16px)',
      }}>
        <Logo size={30} />
        <Link to="/login" className="dark-nav-btn" style={{
          padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
          border: '1.5px solid rgba(167,139,250,0.4)', color: '#A78BFA',
          textDecoration: 'none', background: 'rgba(167,139,250,0.08)',
        }}>
          Approver Login →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', top: -200, right: -100, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', bottom: -100, left: -80, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', top: 80, left: '25%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 30,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
            fontSize: 13, fontWeight: 600, color: '#C4B5FD',
          }}>
            🚀 Django Internal Tool Portal
          </div>

          {/* Headline */}
          <h1 className="hero-title" style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em', color: 'white' }}>
            Request AI &{' '}
            <span style={{ background: 'linear-gradient(135deg, #A78BFA, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SaaS Tools
            </span>
            <br />the smart way
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 500, margin: '0 auto 44px' }}>
            Submit tool requests for your team. HR reviews, the director approves. Simple, fast, transparent.
          </p>

          {/* CTAs */}
          <div className="hero-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
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
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1000, margin: '20px auto 0', padding: '0 24px 100px' }}>
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
    </div>
  );
}
