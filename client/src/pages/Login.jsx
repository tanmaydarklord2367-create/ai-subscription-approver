import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('hr');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, password }),
      });
      if (res.ok) {
        localStorage.setItem('role', role);
        localStorage.setItem('password', password);
        navigate('/dashboard');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <nav className="nav">
        <Link to="/" className="nav-logo">🤖 AI Approver</Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card" style={{ maxWidth: 420, width: '100%', padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Approver Sign In</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
              Sign in to review and approve requests
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Your Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'hr', icon: '👥', label: 'HR Manager' },
                  { value: 'director', icon: '🎯', label: 'Director' },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    style={{
                      padding: '14px 12px',
                      border: `2px solid ${role === r.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      background: role === r.value ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{r.icon}</span>
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: role === r.value ? 'var(--primary)' : 'var(--text-secondary)',
                    }}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoFocus
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
