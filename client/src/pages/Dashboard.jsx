import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <div className="card-meta" style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
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
      <div className="approval-timeline" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: canAct ? 16 : 0, flexWrap: 'wrap' }}>
        <ApprovalStep label="HR Review" status={hrStatus} date={req.hrAction?.at} />
        <div className="approval-connector" style={{ width: 28, height: 2, background: 'var(--border-strong)', flexShrink: 0 }} />
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

  const exportToExcel = async () => {
    const { Workbook } = await import('exceljs');

    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const COLORS = {
      primary: 'FF6366F1',
      border:  'FFE5E7EB',
      zebra:   'FFF6F7FF',
      muted:   'FF6B7280',
      status: {
        approved:         { fill: 'FFECFDF5', text: 'FF065F46' },
        rejected:         { fill: 'FFFEF2F2', text: 'FF991B1B' },
        pending_hr:       { fill: 'FFFFFBEB', text: 'FF92400E' },
        pending_director: { fill: 'FFECFEFF', text: 'FF164E63' },
      },
      type: {
        ai:   { fill: 'FFF0FDF4', text: 'FF166534' },
        saas: { fill: 'FFEFF6FF', text: 'FF1E40AF' },
      },
    };
    const thin = { style: 'thin', color: { argb: COLORS.border } };
    const allBorders = { top: thin, left: thin, bottom: thin, right: thin };
    const STATUS_LABEL = {
      pending_hr: 'Pending HR',
      pending_director: 'Pending Director',
      approved: 'Approved',
      rejected: 'Rejected',
    };

    const wb = new Workbook();
    wb.creator = 'Django Approvals Portal';
    wb.created = new Date();

    /* ── Sheet 1: Requests ── */
    const ws = wb.addWorksheet('Requests', { views: [{ state: 'frozen', ySplit: 4 }] });

    const COLUMNS = [
      { header: '#',                 width: 5  },
      { header: 'Employee Name',     width: 22 },
      { header: 'Email',             width: 28 },
      { header: 'Department',        width: 22 },
      { header: 'Type',              width: 16 },
      { header: 'Tool Name',         width: 22 },
      { header: 'Website',           width: 28 },
      { header: 'Budget (₹)',        width: 14 },
      { header: 'Billing Cycle',     width: 13 },
      { header: 'Status',            width: 17 },
      { header: 'Submitted',         width: 13 },
      { header: 'HR Decision',       width: 13 },
      { header: 'HR Date',           width: 13 },
      { header: 'HR Notes',          width: 26 },
      { header: 'Director Decision', width: 16 },
      { header: 'Director Date',     width: 14 },
      { header: 'Director Notes',    width: 26 },
      { header: 'Reason',            width: 60 },
    ];
    COLUMNS.forEach((c, i) => { ws.getColumn(i + 1).width = c.width; });

    ws.mergeCells('A1:R1');
    ws.getCell('A1').value = '✦ Django — AI & SaaS Tool Requests';
    ws.getCell('A1').font = { size: 16, bold: true, color: { argb: COLORS.primary } };
    ws.getRow(1).height = 26;

    ws.mergeCells('A2:R2');
    ws.getCell('A2').value =
      `Exported ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` +
      ` · ${requests.length} requests · ${stats.pending} pending · ${stats.approved} approved · ${stats.rejected} rejected`;
    ws.getCell('A2').font = { size: 11, italic: true, color: { argb: COLORS.muted } };

    const headerRow = ws.getRow(4);
    COLUMNS.forEach((c, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = c.header;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = allBorders;
    });
    headerRow.height = 22;
    ws.autoFilter = { from: 'A4', to: 'R4' };

    requests.forEach((r, idx) => {
      const row = ws.getRow(5 + idx);
      const values = [
        idx + 1,
        r.employeeName,
        r.employeeEmail,
        r.department,
        r.toolType === 'ai' ? '🤖 AI' : '☁️ SaaS',
        r.toolName,
        r.toolWebsite || '—',
        Number(r.budgetAmount) || 0,
        cap(r.budgetCycle),
        STATUS_LABEL[r.status] || r.status,
        new Date(r.submittedAt),
        r.hrAction?.action ? cap(r.hrAction.action) : 'Pending',
        r.hrAction?.at ? new Date(r.hrAction.at) : '—',
        r.hrAction?.reason || '—',
        r.directorAction?.action ? cap(r.directorAction.action) : '—',
        r.directorAction?.at ? new Date(r.directorAction.at) : '—',
        r.directorAction?.reason || '—',
        r.reason,
      ];
      values.forEach((v, i) => {
        const cell = row.getCell(i + 1);
        cell.value = v;
        cell.border = allBorders;
        cell.alignment = { vertical: 'middle', wrapText: i === 17 };
        if (idx % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.zebra } };
      });

      row.getCell(8).numFmt = '"₹"#,##0';
      [11, 13, 16].forEach(i => {
        const cell = row.getCell(i);
        if (cell.value instanceof Date) cell.numFmt = 'dd mmm yyyy';
      });

      const st = COLORS.status[r.status];
      if (st) {
        const cell = row.getCell(10);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: st.fill } };
        cell.font = { bold: true, color: { argb: st.text } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      const tp = COLORS.type[r.toolType];
      if (tp) {
        const cell = row.getCell(5);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tp.fill } };
        cell.font = { bold: true, color: { argb: tp.text } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (r.toolWebsite) {
        const cell = row.getCell(7);
        cell.value = { text: r.toolWebsite, hyperlink: r.toolWebsite };
        cell.font = { color: { argb: 'FF2563EB' }, underline: true };
      }
    });

    /* ── Sheet 2: Summary ── */
    const sm = wb.addWorksheet('Summary');
    sm.getColumn(1).width = 32;
    sm.getColumn(2).width = 18;

    sm.mergeCells('A1:B1');
    sm.getCell('A1').value = '✦ Django — Export Summary';
    sm.getCell('A1').font = { size: 15, bold: true, color: { argb: COLORS.primary } };
    sm.getRow(1).height = 24;

    const spend = { monthly: 0, annual: 0, 'one-time': 0 };
    requests.filter(r => r.status === 'approved')
      .forEach(r => { spend[r.budgetCycle] += Number(r.budgetAmount) || 0; });

    const deptCounts = {};
    requests.forEach(r => { deptCounts[r.department] = (deptCounts[r.department] || 0) + 1; });

    let rowNum = 3;
    const addSummaryRow = (label, value, opts = {}) => {
      const row = sm.getRow(rowNum++);
      row.getCell(1).value = label;
      row.getCell(1).font = { bold: opts.heading || false, size: opts.heading ? 12 : 11 };
      if (value !== undefined) {
        const cell = row.getCell(2);
        cell.value = value;
        cell.font = { bold: true, color: opts.text ? { argb: opts.text } : undefined };
        if (opts.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fill } };
        if (opts.rupee) cell.numFmt = '"₹"#,##0';
        cell.alignment = { horizontal: 'center' };
      }
    };

    addSummaryRow('Request Counts', undefined, { heading: true });
    addSummaryRow('Total Requests', stats.total);
    addSummaryRow('Pending', stats.pending, COLORS.status.pending_hr);
    addSummaryRow('Approved', stats.approved, COLORS.status.approved);
    addSummaryRow('Rejected', stats.rejected, COLORS.status.rejected);
    rowNum++;
    addSummaryRow('Approved Spend', undefined, { heading: true });
    addSummaryRow('Monthly (recurring)', spend.monthly, { rupee: true });
    addSummaryRow('Annual (recurring)', spend.annual, { rupee: true });
    addSummaryRow('One-time', spend['one-time'], { rupee: true });
    rowNum++;
    addSummaryRow('Requests by Department', undefined, { heading: true });
    Object.entries(deptCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([dept, count]) => addSummaryRow(dept, count));

    /* ── Download ── */
    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `django-tool-requests-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const FILTERS = [
    { key: 'all',      label: 'All',      count: stats.total    },
    { key: 'pending',  label: 'Pending',  count: stats.pending  },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div className="mesh-bg" style={{ minHeight: '100vh' }}>
      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(99,102,241,0.10)', top: -120, right: -120, position: 'fixed' }} />
      <div className="blob" style={{ width: 320, height: 320, background: 'rgba(236,72,153,0.08)', bottom: -100, left: -100, position: 'fixed' }} />
      {/* Nav */}
      <nav className="nav">
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size={28} light /></Link>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`nav-role-badge badge ${role === 'hr' ? 'badge-pending-hr' : 'badge-pending-director'}`}>
            {role === 'hr' ? '👥 HR Manager' : '🎯 Director'}
          </span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="page-content" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', position: 'relative' }}>
        {/* Page header */}
        <div className="dash-header fade-up" style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          ].map((s, i) => (
            <div key={s.label} className={`card fade-up-${i + 1}`} style={{ padding: '20px 22px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.grad, borderRadius: '14px 14px 0 0' }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 8, marginTop: 4 }}>{s.icon} {s.label.toUpperCase()}</div>
              <div style={{ fontSize: 34, fontWeight: 900, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters + refresh */}
        <div className="filter-tabs" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
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
