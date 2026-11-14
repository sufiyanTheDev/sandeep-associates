import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
  Phone,
} from 'lucide-react';
import './admin-workspace.css';

const initialQueries = [
  { id: 'SSA-1024', name: 'Arun Kumar', email: 'arun.kumar@example.com', phone: '+91 98765 43210', subject: 'Company Incorporation', message: 'I am planning to incorporate a private limited company and would like to understand the process, documents and expected timeline.', organization: 'Aster Technologies', designation: 'Founder', city: 'Chennai', date: '14 Nov 2026', time: '10:42 AM', status: 'NEW', professional_updates: true },
  { id: 'SSA-1023', name: 'Priya Raman', email: 'priya.raman@example.com', phone: '+91 98401 22334', subject: 'FEMA Advisory', message: 'We need guidance on an inward remittance and the applicable FEMA reporting requirements.', organization: 'Raman Exports', designation: 'Director', city: 'Coimbatore', date: '13 Nov 2026', time: '04:18 PM', status: 'IN_PROGRESS', professional_updates: false },
  { id: 'SSA-1022', name: 'Northstar Ventures', email: 'finance@northstar.example', phone: '+91 90030 11223', subject: 'Valuation Services', message: 'Please share the scope and information required for a valuation engagement.', organization: 'Northstar Ventures', designation: 'Finance Team', city: 'Bengaluru', date: '12 Nov 2026', time: '11:05 AM', status: 'NEW', professional_updates: true },
  { id: 'SSA-1021', name: 'Mohammed Faizal', email: 'faizal@example.com', phone: '+91 97908 44556', subject: 'Annual Compliance', message: 'We would like assistance with our annual company compliance and filings.', organization: 'FM Logistics', designation: 'Managing Partner', city: 'Chennai', date: '11 Nov 2026', time: '02:30 PM', status: 'RESOLVED', professional_updates: false },
  { id: 'SSA-1020', name: 'Kavitha S.', email: 'kavitha@example.com', phone: '+91 98844 11220', subject: 'Secretarial Audit', message: 'Looking for support with secretarial audit requirements for the current financial year.', organization: 'Kavitha Industries', designation: 'Company Secretary', city: 'Madurai', date: '10 Nov 2026', time: '09:15 AM', status: 'CLOSED', professional_updates: true },
];

const statusLabels = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

function BrandMark() {
  return (
    <Link className="aw-brand" to="/">
      <span className="aw-brand-mark">CS</span>
      <span className="aw-brand-copy"><b>S. SANDEEP <i>&</i> ASSOCIATES</b><small>COMPANY SECRETARIES</small></span>
    </Link>
  );
}

function StatusPill({ status }) {
  return <span className={`aw-status aw-status-${status.toLowerCase()}`}>{statusLabels[status] || status}</span>;
}

function MetricCard({ icon: Icon, label, value, note, trend }) {
  return (
    <article className="aw-metric-card">
      <div className="aw-metric-top"><span className="aw-metric-icon"><Icon size={18} /></span><span className="aw-metric-note">{note}</span></div>
      <div className="aw-metric-value">{value}</div>
      <div className="aw-metric-bottom"><span>{label}</span><span className={trend === 'up' ? 'aw-trend-up' : 'aw-trend-neutral'}>{trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span></div>
    </article>
  );
}

function QueryDetail({ query, onClose, onStatusChange }) {
  if (!query) return null;
  return (
    <div className="aw-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="aw-detail-modal" role="dialog" aria-modal="true" aria-labelledby="aw-detail-title">
        <header className="aw-detail-header">
          <div><span className="aw-eyebrow">ENQUIRY DETAILS · {query.id}</span><h2 id="aw-detail-title">{query.name}</h2><p>Received on {query.date} at {query.time}</p></div>
          <button className="aw-icon-button" onClick={onClose} aria-label="Close details"><X size={19} /></button>
        </header>
        <div className="aw-detail-body">
          <div className="aw-detail-status"><span>Current status</span><select value={query.status} onChange={(event) => onStatusChange(query.id, event.target.value)} aria-label="Update enquiry status">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="aw-detail-grid">
            <div><span><Mail size={14} /> Email</span><b>{query.email}</b></div>
            <div><span><Phone size={14} /> Mobile</span><b>{query.phone}</b></div>
            <div><span><BriefcaseBusiness size={14} /> Organization</span><b>{query.organization || '—'}</b></div>
            <div><span><UserRound size={14} /> Designation</span><b>{query.designation || '—'}</b></div>
            <div><span><MapPin size={14} /> City</span><b>{query.city || '—'}</b></div>
            <div><span><CheckCircle2 size={14} /> Professional updates</span><b>{query.professional_updates ? 'Opted in' : 'Not opted in'}</b></div>
          </div>
          <div className="aw-detail-message"><span>Area of enquiry</span><h3>{query.subject}</h3><span>Message</span><p>{query.message}</p></div>
        </div>
        <footer className="aw-detail-footer"><span><ShieldCheck size={15} /> Internal administrative record</span><button className="aw-button aw-button-outline" onClick={onClose}>Close</button></footer>
      </section>
    </div>
  );
}

export default function AdminWorkspace() {
  const location = useLocation();
  const isQueries = location.pathname.includes('/queries');
  const isApplications = location.pathname.includes('/applications');
  const [queries, setQueries] = useState(initialQueries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => queries.filter((item) => {
    const term = search.toLowerCase().trim();
    const matchesSearch = !term || [item.name, item.email, item.phone, item.subject, item.organization, item.id].some((value) => String(value || '').toLowerCase().includes(term));
    return matchesSearch && (statusFilter === 'ALL' || item.status === statusFilter);
  }), [queries, search, statusFilter]);

  const counts = useMemo(() => ({
    total: queries.length,
    new: queries.filter((item) => item.status === 'NEW').length,
    progress: queries.filter((item) => item.status === 'IN_PROGRESS').length,
    resolved: queries.filter((item) => item.status === 'RESOLVED' || item.status === 'CLOSED').length,
  }), [queries]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  const updateStatus = (id, status) => {
    setQueries((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setSelected((current) => current?.id === id ? { ...current, status } : current);
  };

  const title = isApplications ? 'Career applications' : isQueries ? 'Incoming enquiries' : 'Good afternoon';

  return (
    <div className="adminapp aw-shell">
      <aside className="aw-sidebar">
        <BrandMark />
        <div className="aw-workspace-label">WORKSPACE</div>
        <nav className="aw-nav" aria-label="Admin navigation">
          <NavLink end to="/admin/dashboard" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><LayoutDashboard size={17} /> Overview</NavLink>
          <NavLink to="/admin/queries" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><MessageSquare size={17} /> Enquiries <span className="aw-nav-count">{counts.new}</span></NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><BriefcaseBusiness size={17} /> Applications</NavLink>
        </nav>
        <div className="aw-sidebar-bottom"><div className="aw-admin-card"><span className="aw-avatar">SA</span><span><b>Administrator</b><small>Workspace access</small></span><MoreHorizontal size={17} /></div><Link className="aw-back-link" to="/"><LogOut size={15} /> Back to website</Link></div>
      </aside>

      <main className="aw-main">
        <header className="aw-topbar"><div className="aw-breadcrumb">Workspace <span>/</span> <b>{isQueries ? 'Enquiries' : isApplications ? 'Applications' : 'Overview'}</b></div><div className="aw-topbar-right"><span className="aw-secure-label"><ShieldCheck size={15} /> Secure admin area</span><span className="aw-avatar aw-avatar-small">SA</span></div></header>
        <div className="aw-content">
          <div className="aw-page-heading"><div><span className="aw-eyebrow">S. SANDEEP & ASSOCIATES · ADMINISTRATION</span><h1>{title}</h1><p>{isQueries ? 'Review and manage incoming client enquiries.' : isApplications ? 'Review applications submitted by prospective candidates.' : 'Here is an overview of your enquiry activity.'}</p></div><div className="aw-date-chip"><CalendarDays size={15} /> 14 November 2026</div></div>

          {!isApplications && <section className="aw-metrics" aria-label="Enquiry summary"><MetricCard icon={MessageSquare} label="Total enquiries" value={counts.total.toString().padStart(2, '0')} note="All received" trend="up" /><MetricCard icon={Clock3} label="New enquiries" value={counts.new.toString().padStart(2, '0')} note="Needs attention" trend="up" /><MetricCard icon={Users} label="In progress" value={counts.progress.toString().padStart(2, '0')} note="Being reviewed" trend="neutral" /><MetricCard icon={CheckCircle2} label="Resolved" value={counts.resolved.toString().padStart(2, '0')} note="Completed" trend="neutral" /></section>}

          {isApplications ? (
            <section className="aw-empty-panel"><span className="aw-empty-icon"><BriefcaseBusiness size={23} /></span><h2>Career applications</h2><p>Career application management will be added in the next stage. This workspace is currently showing enquiry management using sample records.</p></section>
          ) : (
            <section className="aw-panel">
              <div className="aw-panel-heading"><div><span className="aw-eyebrow">INBOX</span><h2>{isQueries ? 'All enquiries' : 'Recent enquiries'}</h2><p>{isQueries ? 'Search, filter and review client submissions.' : 'The latest submissions requiring your attention.'}</p></div>{!isQueries && <Link className="aw-text-link" to="/admin/queries">View all enquiries <ArrowUpRight size={15} /></Link>}</div>
              <div className="aw-toolbar"><label className="aw-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, subject or ID" /></label><label className="aw-filter"><span>Status</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option value="ALL">All statuses</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label></div>
              <div className="aw-table-wrap"><table className="aw-table"><thead><tr><th>Enquiry</th><th>Area of enquiry</th><th>Received</th><th>Status</th><th><span className="aw-sr-only">Action</span></th></tr></thead><tbody>{paginated.length ? paginated.map((item) => <tr key={item.id}><td><div className="aw-person"><span className="aw-person-avatar">{item.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><span><b>{item.name}</b><small>{item.email}</small></span></div></td><td><span className="aw-subject">{item.subject}</span><small className="aw-org">{item.organization || item.city}</small></td><td><span className="aw-date">{item.date}</span><small className="aw-org">{item.time}</small></td><td><StatusPill status={item.status} /></td><td><button className="aw-view-button" onClick={() => setSelected(item)}>View details <ArrowUpRight size={14} /></button></td></tr>) : <tr><td colSpan="5" className="aw-no-results">No enquiries match your search.</td></tr>}</tbody></table></div>
              <div className="aw-table-footer"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} enquiries</span><div className="aw-pagination"><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={16} /></button><span>{page} / {pageCount}</span><button disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
            </section>
          )}
          <footer className="aw-footer"><span>© 2026 S. Sandeep & Associates</span><span><ShieldCheck size={13} /> Internal workspace · Sample data</span></footer>
        </div>
      </main>
      <QueryDetail query={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />
    </div>
  );
}
