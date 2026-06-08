import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Logo from '../components/Logo';

/* ─── Helpers ─── */
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtBudget(amount, cycle) {
  const label = cycle === 'one-time' ? 'one-time' : `/${cycle === 'monthly' ? 'mo' : 'yr'}`;
  return `₹${amount}${label}`;
}

/* ─── Approval step pill ─── */
function ApprovalStep({ label, status, date }) {
  const styles = {
    waiting:  { bg: 'var(--bg)',           text: 'var(--text-muted)',  border: 'var(--border)'      },
    pending:  { bg: 'var(--warning-light)', text: '#92400E',           border: '#FCD34D'             },
    approved: { bg: 'var(--success-light)', text: '#065F46',           border: '#6EE7B7'             },
    rejected: { bg: 'var(--danger-light)',  text: '#991B1B',           border: '#FCA5A5'             },
  };
  const icons = { waiting: '○', pending: '⏳', approved: '✓', rejected: '✗' };
  const c = styles[status];

  return (
    <div style={{
      padding: '7px 12px',
      borderRadius: 'var(--radius)',
      background: c.bg,
      border: `1px solid ${c.border}`,
      minWidth: 130,
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: c.text }}>
        {icons[status]} {label}
      </div>
      {date && (
        <div style={{ fontSize: 11, color: c.text, marginTop: 2, opacity: 0.75 }}>
          {fmtDate(date)}
        </div>
      )}
    </div>
  );
}

/* ─── Request card ─── */
function RequestCard({ request: req, canAct, actionLoading, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);

  const STATUS_META = {
    pending_hr:       { label: 'Pending HR',       cls: 'badge-pending-hr',       icon: '⏳' },
    pending_director: { label: 'Pending Director',  cls: 'badge-pending-director', icon: '⏳' },
    approved:         { label: 'Approved',          cls: 'badge-approved',         icon: '✓' },
    rejected:         { label: 'Rejected',          cls: 'badge-rejected',         icon: '✗' },
  };

  const meta = STATUS_META[req.status];
  const truncated = req.reason.length > 160;
  const displayReason = expanded || !truncated ? req.reason : req.reason.slice(0, 160) + '…';

  const hrStatus =
    req.status === 'pending_hr' ? 'pending'
    : req.hrAction?.action === 'approved' ? 'approved'
    : req.hrAction?.action === 'rejected' ? 'rejected'
    : 'pending';

  const dirStatus =
    req.status === 'pending_hr' ? 'waiting'
    : req.status === 'pending_director' ? 'pending'
    : req.directorAction?.action === 'approved' ? 'approved'
    : req.directorAction?.action === 'rejected' ? 'rejected'
    : 'waiting';

  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {req.toolName}
            </h3>
            {req.toolWebsite && (
              <a
                href={req.toolWebsite}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
              >
                ↗ Website
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              {req.department}
            </span>
            <span className="badge" style={{
              background: req.toolType === 'ai' ? '#F0FDF4' : '#EFF6FF',
              color: req.toolType === 'ai' ? '#166534' : '#1E40AF',
            }}>
              {req.toolType === 'ai' ? '🤖 AI Subscription' : '☁️ SaaS Software'}
            </span>
            <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              💰 {fmtBudget(req.budgetAmount, req.budgetCycle)}
            </span>
          </div>
        </div>
        <span className={`badge ${meta.cls}`} style={{ flexShrink: 0 }}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {/* Employee info */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <span>👤 {req.employeeName}</span>
        <span>✉ {req.employeeEmail}</span>
        <span>📅 Submitted {fmtDate(req.submittedAt)}</span>
      </div>

      {/* Reason */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
          {displayReason}
          {truncated && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                marginLeft: 6, color: 'var(--primary)', background: 'none',
                border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0,
              }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Approval timeline */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: canAct ? 16 : 0, flexWrap: 'wrap' }}>
        <ApprovalStep label="HR Review" status={hrStatus} date={req.hrAction?.at} />
        <div style={{ width: 28, height: 2, background: 'var(--border-strong)', flexShrink: 0 }} />
        <ApprovalStep label="Director Review" status={dirStatus} date={req.directorAction?.at} />
      </div>

      {/* Rejection reason */}
      {req.status === 'rejected' && (req.hrAction?.reason || req.directorAction?.reason) && (
        <div style={{
          marginTop: 12, padding: '10px 14px',
          background: 'var(--danger-light)', borderRadius: 'var(--radius)',
          fontSize: 13, color: '#991B1B',
          border: '1px solid #FCA5A5',
        }}>
          <strong>Rejection reason:</strong> {req.hrAction?.reason || req.directorAction?.reason}
        </div>
      )}

      {/* Action buttons */}
      {canAct && (
        <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 4 }}>
          <button
            className="btn btn-success btn-sm"
            onClick={onApprove}
            disabled={actionLoading === req.id + '_approve'}
          >
            {actionLoading === req.id + '_approve' ? 'Approving…' : '✓ Approve'}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={onReject}
          >
            ✗ Reject
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard page ─── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const role = localStorage.getItem('role');
  const password = localStorage.getItem('password');

  const authHeaders = {
    'x-role': role,
    'x-password': password,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (!role || !password) { navigate('/login'); return; }
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/requests', { headers: authHeaders });
      if (res.status === 401) { localStorage.clear(); navigate('/login'); return; }
      setRequests(await res.json());
    } catch {
      /* server not yet ready */
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id + '_approve');
    try {
      await fetch(`/api/requests/${id}/approve`, { method: 'PUT', headers: authHeaders });
      fetchRequests();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget + '_reject');
    try {
      await fetch(`/api/requests/${rejectTarget}/reject`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ reason: rejectReason }),
      });
      setRejectTarget(null);
      setRejectReason('');
      fetchRequests();
    } finally {
      setActionLoading(null);
    }
  };

  const canAct = (req) =>
    (role === 'hr' && req.status === 'pending_hr') ||
    (role === 'director' && req.status === 'pending_director');

  const stats = {
    total:    requests.length,
    pending:  requests.filter(r => r.status.startsWith('pending')).length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const myPending =
    role === 'hr'
      ? requests.filter(r => r.status === 'pending_hr').length
      : requests.filter(r => r.status === 'pending_director').length;

  const filtered = requests.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'pending') return r.status.startsWith('pending');
    return r.status === filter;
  });

  const logout = () => { localStorage.clear(); navigate('/'); };

  const exportToExcel = () => {
    const rows = requests.map(r => ({
      'Employee Name':        r.employeeName,
      'Employee Email':       r.employeeEmail,
      'Department':           r.department,
      'Subscription Type':    r.toolType === 'ai' ? 'AI Subscription' : 'SaaS Software',
      'Tool Name':            r.toolName,
      'Tool Website':         r.toolWebsite || '',
      'Budget Amount':        `₹${r.budgetAmount}`,
      'Billing Cycle':        r.budgetCycle,
      'Reason':               r.reason,
      'Status':               r.status === 'pending_hr' ? 'Pending HR'
                              : r.status === 'pending_director' ? 'Pending Director'
                              : r.status.charAt(0).toUpperCase() + r.status.slice(1),
      'Submitted Date':       new Date(r.submittedAt).toLocaleDateString(),
      'HR Decision':          r.hrAction?.action || 'Pending',
      'HR Decision Date':     r.hrAction?.at ? new Date(r.hrAction.at).toLocaleDateString() : '',
      'HR Notes':             r.hrAction?.reason || '',
      'Director Decision':    r.directorAction?.action || '',
      'Director Decision Date': r.directorAction?.at ? new Date(r.directorAction.at).toLocaleDateString() : '',
      'Director Notes':       r.directorAction?.reason || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [20,25,15,20,20,15,12,50,18,12,15,18,12,15,20,12].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
    XLSX.writeFile(wb, `ai-requests-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const FILTERS = [
    { key: 'all',      label: 'All',      count: stats.total    },
    { key: 'pending',  label: 'Pending',  count: stats.pending  },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav className="nav">
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size={28} light /></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`badge ${role === 'hr' ? 'badge-pending-hr' : 'badge-pending-director'}`}>
            {role === 'hr' ? '👥 HR Manager' : '🎯 Director'}
          </span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>
            {role === 'hr' ? 'HR Review Dashboard' : 'Director Approval Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            {role === 'hr'
              ? 'Review incoming requests and pass approved ones to the director.'
              : 'Give final approval on requests already reviewed by HR.'}
            {myPending > 0 && (
              <span style={{
                marginLeft: 10, background: 'var(--danger)', color: 'white',
                borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 600,
              }}>
                {myPending} awaiting you
              </span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div
          className="stats-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}
        >
          {[
            { label: 'Total Requests', value: stats.total,    icon: '📋', grad: 'linear-gradient(135deg,#6366F1,#8B5CF6)' },
            { label: 'Pending',        value: stats.pending,  icon: '⏳', grad: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
            { label: 'Approved',       value: stats.approved, icon: '✅', grad: 'linear-gradient(135deg,#059669,#10B981)' },
            { label: 'Rejected',       value: stats.rejected, icon: '❌', grad: 'linear-gradient(135deg,#DC2626,#F87171)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '20px 22px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.grad, borderRadius: '14px 14px 0 0' }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 8, marginTop: 4 }}>{s.icon} {s.label.toUpperCase()}</div>
              <div style={{ fontSize: 34, fontWeight: 900, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters + refresh */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key !== 'all' && (
                <span style={{ opacity: 0.75 }}>({f.count})</span>
              )}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={fetchRequests}>
              ↻ Refresh
            </button>
            <button className="btn btn-outline btn-sm" onClick={exportToExcel} disabled={requests.length === 0}>
              📥 Export to Excel
            </button>
          </div>
        </div>

        {/* Request list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Loading requests…
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              No {filter !== 'all' ? filter : ''} requests found.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                canAct={canAct(req)}
                actionLoading={actionLoading}
                onApprove={() => handleApprove(req.id)}
                onReject={() => setRejectTarget(req.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      {rejectTarget && (
        <div className="modal-overlay" onClick={() => setRejectTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Reject Request</h3>
            <div className="form-group">
              <label className="form-label">
                Reason for rejection{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                className="form-textarea"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Provide feedback so the employee knows what to change or resubmit…"
                rows={4}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={actionLoading === rejectTarget + '_reject'}
              >
                {actionLoading === rejectTarget + '_reject' ? 'Rejecting…' : '✗ Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
