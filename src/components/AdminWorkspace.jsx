import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Download,
  FileText,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { adminApi } from './admin-api.js';
import './admin-workspace.css';

const statusLabels = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const statusOptions = Object.entries(statusLabels);

const careerStatusLabels = {
  RECEIVED: 'Received',
  REVIEWING: 'Reviewing',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW: 'Interview',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
};
const careerStatusOptions = Object.entries(careerStatusLabels);

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).format(new Date(value));
}

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '—';
}

function BrandMark() {
  return (
    <Link className="aw-brand" to="/">
      <span className="aw-brand-mark">CS</span>
      <span className="aw-brand-copy"><b>S. SANDEEP <i>&</i> ASSOCIATES</b><small>COMPANY SECRETARIES</small></span>
    </Link>
  );
}

function StatusPill({ status }) {
  return <span className={`aw-status aw-status-${String(status || '').toLowerCase()}`}>{statusLabels[status] || status}</span>;
}

function MetricCard({ icon: Icon, label, value, note, trend = 'neutral' }) {
  return (
    <article className="aw-metric-card">
      <div className="aw-metric-top"><span className="aw-metric-icon"><Icon size={18} /></span><span className="aw-metric-note">{note}</span></div>
      <div className="aw-metric-value">{Number(value || 0).toString().padStart(2, '0')}</div>
      <div className="aw-metric-bottom"><span>{label}</span><span className={trend === 'up' ? 'aw-trend-up' : 'aw-trend-neutral'}>{trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}</span></div>
    </article>
  );
}

function QueryDetail({ query, onClose, onStatusChange, isUpdating, error }) {
  if (!query) return null;

  return (
    <div className="aw-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="aw-detail-modal" role="dialog" aria-modal="true" aria-labelledby="aw-detail-title">
        <header className="aw-detail-header">
          <div>
            <span className="aw-eyebrow">ENQUIRY DETAILS · {query.id}</span>
            <h2 id="aw-detail-title">{query.name}</h2>
            <p>Received on {formatDate(query.created_at)} at {formatTime(query.created_at)}</p>
          </div>
          <button className="aw-icon-button" onClick={onClose} aria-label="Close details"><X size={19} /></button>
        </header>
        <div className="aw-detail-body">
          <div className="aw-detail-status">
            <span>Current status</span>
            <select
              value={query.status}
              disabled={isUpdating}
              onChange={(event) => onStatusChange(query.id, event.target.value)}
              aria-label="Update enquiry status"
            >
              {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          {error && <div className="aw-form-alert" role="alert">{error}</div>}
          <div className="aw-detail-grid">
            <div><span><Mail size={14} /> Email</span><b>{query.email || '—'}</b></div>
            <div><span><Phone size={14} /> Mobile</span><b>{query.phone || '—'}</b></div>
            <div><span><BriefcaseBusiness size={14} /> Organization</span><b>{query.organization || '—'}</b></div>
            <div><span><UserRound size={14} /> Designation</span><b>{query.designation || '—'}</b></div>
            <div><span><MapPin size={14} /> City</span><b>{query.city || '—'}</b></div>
            <div><span><CheckCircle2 size={14} /> Professional updates</span><b>{query.professional_updates ? 'Opted in' : 'Not opted in'}</b></div>
          </div>
          <div className="aw-detail-message"><span>Area of enquiry</span><h3>{query.subject || '—'}</h3><span>Message</span><p>{query.message || 'No message provided.'}</p></div>
        </div>
        <footer className="aw-detail-footer"><span><ShieldCheck size={15} /> Internal administrative record</span><button className="aw-button aw-button-outline" onClick={onClose}>Close</button></footer>
      </section>
    </div>
  );
}

function CareerApplicationDetail({ application, onClose, onStatusChange, onDownload, isUpdating, isDownloading, error }) {
  if (!application) return null;
  const experience = `${application.experience_years} year${application.experience_years === 1 ? '' : 's'}${application.experience_months ? `, ${application.experience_months} month${application.experience_months === 1 ? '' : 's'}` : ''}`;
  const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="aw-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="aw-detail-modal aw-career-modal" role="dialog" aria-modal="true" aria-labelledby="aw-career-detail-title">
        <header className="aw-detail-header">
          <div>
            <span className="aw-eyebrow">CAREER APPLICATION · {application.id}</span>
            <h2 id="aw-career-detail-title">{application.name}</h2>
            <p>Received on {formatDate(application.created_at)} at {formatTime(application.created_at)}</p>
          </div>
          <button className="aw-icon-button" onClick={onClose} aria-label="Close details"><X size={19} /></button>
        </header>
        <div className="aw-detail-body">
          <div className="aw-detail-status">
            <span>Application status</span>
            <select value={application.status} disabled={isUpdating} onChange={(event) => onStatusChange(application.id, event.target.value)} aria-label="Update application status">
              {careerStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          {error && <div className="aw-form-alert" role="alert">{error}</div>}
          <div className="aw-career-section-title">Applicant information</div>
          <div className="aw-detail-grid">
            <div><span><Mail size={14} /> Email</span><b>{application.email || '—'}</b></div>
            <div><span><Phone size={14} /> Mobile</span><b>{application.phone || '—'}</b></div>
            <div><span><BriefcaseBusiness size={14} /> Position</span><b>{application.position || 'Not specified'}</b></div>
            <div><span><FileText size={14} /> Qualification</span><b>{application.qualification || '—'}</b></div>
            <div><span><Clock3 size={14} /> Experience</span><b>{experience}</b></div>
            <div><span><Users size={14} /> Current / last company</span><b>{application.current_company || '—'}</b></div>
            <div className="aw-career-link"><span><ExternalLink size={14} /> LinkedIn</span>{application.linkedin_url ? <a href={application.linkedin_url} target="_blank" rel="noreferrer">View profile <ExternalLink size={12} /></a> : <b>—</b>}</div>
          </div>
          <div className="aw-detail-message"><span>Additional message</span><p>{application.message || 'No additional message provided.'}</p></div>
          <div className="aw-resume-row">
            <div className="aw-resume-info"><span className="aw-resume-icon"><FileText size={18} /></span><span><b>{application.resume_original_filename}</b><small>PDF document · {formatBytes(application.resume_size_bytes)}</small></span></div>
            <button className="aw-button aw-button-gold" type="button" onClick={() => onDownload(application.id)} disabled={isDownloading}><Download size={14} /> {isDownloading ? 'Downloading…' : 'Download resume'}</button>
          </div>
          <div className="aw-career-section-title">Status history</div>
          {application.audit_history?.length ? <ol className="aw-audit-list">{application.audit_history.map((entry) => <li key={entry.id}><span className="aw-audit-dot" /><div><b>{entry.action === 'STATUS_CHANGED' ? 'Status changed' : entry.action}</b><p>{entry.previous_value?.status ? `${careerStatusLabels[entry.previous_value.status] || entry.previous_value.status} → ` : ''}{careerStatusLabels[entry.new_value?.status] || entry.new_value?.status || 'Updated'}</p><small>{formatDate(entry.created_at)} · {formatTime(entry.created_at)}</small></div></li>)}</ol> : <p className="aw-audit-empty">No status changes recorded yet.</p>}
        </div>
        <footer className="aw-detail-footer"><span><ShieldCheck size={15} /> Confidential applicant record</span><button className="aw-button aw-button-outline" onClick={onClose}>Close</button></footer>
      </section>
    </div>
  );
}

export default function AdminWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const isQueries = location.pathname.includes('/queries');
  const isApplications = location.pathname.includes('/applications');
  const pageSize = isQueries ? 10 : 5;

  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [queries, setQueries] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationTotal, setApplicationTotal] = useState(0);
  const [applicationTotalPages, setApplicationTotalPages] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [isCareerUpdating, setIsCareerUpdating] = useState(false);
  const [isResumeDownloading, setIsResumeDownloading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [careerSearch, setCareerSearch] = useState('');
  const [careerStatusFilter, setCareerStatusFilter] = useState('ALL');
  const [careerPage, setCareerPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pageError, setPageError] = useState('');
  const [detailError, setDetailError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const handleUnauthorized = useCallback((error) => {
    if (error?.status === 401) {
      navigate('/admin/login', { replace: true, state: { reason: 'session-expired' } });
      return true;
    }
    return false;
  }, [navigate]);

  // Validate the existing HttpOnly admin session before loading protected data.
  useEffect(() => {
    let active = true;
    adminApi('/api/v1/admin/me')
      .then((data) => { if (active) setAdmin(data); })
      .catch((error) => {
        if (active) navigate('/admin/login', { replace: true });
      })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  const loadSummary = useCallback(async () => {
    try {
      const data = await adminApi('/api/v1/admin/dashboard/summary');
      setSummary(data);
    } catch (error) {
      if (!handleUnauthorized(error)) setPageError(error.message || 'Unable to load dashboard summary.');
    }
  }, [handleUnauthorized]);

  const loadQueries = useCallback(async () => {
    setIsLoading(true);
    setPageError('');
    const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
    if (search.trim()) params.set('search', search.trim());
    if (statusFilter !== 'ALL') params.set('status', statusFilter);

    try {
      const data = await adminApi(`/api/v1/admin/queries?${params.toString()}`);
      setQueries(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 0);
    } catch (error) {
      if (!handleUnauthorized(error)) setPageError(error.message || 'Unable to load enquiries.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, statusFilter, handleUnauthorized]);

  const loadApplications = useCallback(async () => {
    setIsApplicationLoading(true);
    setPageError('');
    const params = new URLSearchParams({ page: String(careerPage), page_size: '20' });
    if (careerSearch.trim()) params.set('search', careerSearch.trim());
    if (careerStatusFilter !== 'ALL') params.set('status', careerStatusFilter);
    try {
      const data = await adminApi(`/api/v1/admin/career-applications?${params.toString()}`);
      setApplications(data.items || []);
      setApplicationTotal(data.total || 0);
      setApplicationTotalPages(data.total_pages || 0);
    } catch (error) {
      if (!handleUnauthorized(error)) setPageError(error.message || 'Unable to load career applications.');
    } finally {
      setIsApplicationLoading(false);
    }
  }, [careerPage, careerSearch, careerStatusFilter, handleUnauthorized]);

  const openApplicationDetails = async (id) => {
    setDetailError('');
    try {
      const data = await adminApi(`/api/v1/admin/career-applications/${id}`);
      setSelectedApplication(data);
    } catch (error) {
      if (!handleUnauthorized(error)) setPageError(error.message || 'Unable to load application details.');
    }
  };

  const updateCareerStatus = async (id, status) => {
    setIsCareerUpdating(true);
    setDetailError('');
    try {
      const data = await adminApi(`/api/v1/admin/career-applications/${id}/status`, {
        method: 'PATCH', body: JSON.stringify({ status }),
      });
      const refreshed = await adminApi(`/api/v1/admin/career-applications/${id}`);
      setSelectedApplication(refreshed);
      setApplications((current) => current.map((item) => item.id === id ? { ...item, status: data.status, updated_at: data.updated_at } : item));
      await loadApplications();
    } catch (error) {
      if (!handleUnauthorized(error)) setDetailError(error.message || 'Unable to update application status.');
    } finally {
      setIsCareerUpdating(false);
    }
  };

  const downloadResume = async (id) => {
    setIsResumeDownloading(true);
    setDetailError('');
    try {
      await adminApi.download(`/api/v1/admin/career-applications/${id}/resume`);
    } catch (error) {
      if (!handleUnauthorized(error)) setDetailError(error.message || 'Unable to download resume.');
    } finally {
      setIsResumeDownloading(false);
    }
  };

  useEffect(() => {
    if (!admin) return;
    loadSummary();
  }, [admin, loadSummary]);

  useEffect(() => {
    if (!admin) return;
    const timer = window.setTimeout(loadQueries, 300);
    return () => window.clearTimeout(timer);
  }, [admin, loadQueries]);

  useEffect(() => {
    if (!admin || !isApplications) return;
    const timer = window.setTimeout(loadApplications, 300);
    return () => window.clearTimeout(timer);
  }, [admin, isApplications, loadApplications]);

  const openDetails = async (id) => {
    setDetailError('');
    try {
      const data = await adminApi(`/api/v1/admin/queries/${id}`);
      setSelected(data);
    } catch (error) {
      if (!handleUnauthorized(error)) setPageError(error.message || 'Unable to load enquiry details.');
    }
  };

  const updateStatus = async (id, status) => {
    setIsUpdating(true);
    setDetailError('');
    try {
      const data = await adminApi(`/api/v1/admin/queries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setSelected((current) => current?.id === id ? { ...current, status: data.status, updated_at: data.updated_at } : current);
      await Promise.all([loadSummary(), loadQueries()]);
    } catch (error) {
      if (!handleUnauthorized(error)) setDetailError(error.message || 'Unable to update enquiry status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await adminApi('/api/v1/admin/logout', { method: 'POST' });
    } catch (error) {
      // Even if the network fails, leave the protected workspace.
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  const title = isApplications ? 'Career applications' : isQueries ? 'Incoming enquiries' : 'Good afternoon';
  const todayLabel = useMemo(() => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()), []);

  if (authLoading) {
    return <div className="aw-loading-screen"><span className="aw-loading-spinner" />Verifying administrator session…</div>;
  }
  if (!admin) return null;

  return (
    <div className="adminapp aw-shell">
      <aside className="aw-sidebar">
        <BrandMark />
        <div className="aw-workspace-label">WORKSPACE</div>
        <nav className="aw-nav" aria-label="Admin navigation">
          <NavLink end to="/admin/dashboard" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><LayoutDashboard size={17} /> Overview</NavLink>
          <NavLink to="/admin/queries" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><MessageSquare size={17} /> Enquiries <span className="aw-nav-count">{summary?.new_enquiries ?? '—'}</span></NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => `aw-nav-link${isActive ? ' active' : ''}`}><BriefcaseBusiness size={17} /> Applications</NavLink>
        </nav>
        <div className="aw-sidebar-bottom">
          <div className="aw-admin-card"><span className="aw-avatar">SA</span><span><b>Administrator</b><small>{admin.email || 'Workspace access'}</small></span><MoreHorizontal size={17} /></div>
          <button className="aw-back-link aw-logout-button" type="button" onClick={logout} disabled={loggingOut}><LogOut size={15} /> {loggingOut ? 'Signing out…' : 'Sign out'}</button>
          <Link className="aw-back-link" to="/">Back to website</Link>
        </div>
      </aside>

      <main className="aw-main">
        <header className="aw-topbar"><div className="aw-breadcrumb">Workspace <span>/</span> <b>{isQueries ? 'Enquiries' : isApplications ? 'Applications' : 'Overview'}</b></div><div className="aw-topbar-right"><span className="aw-secure-label"><ShieldCheck size={15} /> Secure admin area</span><span className="aw-avatar aw-avatar-small">SA</span></div></header>
        <div className="aw-content">
          <div className="aw-page-heading"><div><span className="aw-eyebrow">S. SANDEEP & ASSOCIATES · ADMINISTRATION</span><h1>{title}</h1><p>{isQueries ? 'Review and manage incoming client enquiries.' : isApplications ? 'Review applications submitted by prospective candidates.' : 'Here is an overview of your enquiry activity.'}</p></div><div className="aw-date-chip"><CalendarDays size={15} /> {todayLabel}</div></div>

          {!isApplications && <section className="aw-metrics" aria-label="Enquiry summary">
            <MetricCard icon={MessageSquare} label="Total enquiries" value={summary?.total_enquiries} note="All received" trend="up" />
            <MetricCard icon={Clock3} label="New enquiries" value={summary?.new_enquiries} note="Needs attention" trend="up" />
            <MetricCard icon={Users} label="In progress" value={summary?.in_progress_enquiries} note="Being reviewed" />
            <MetricCard icon={CheckCircle2} label="Resolved" value={summary?.resolved_enquiries} note="Completed" />
          </section>}

          {isApplications ? (
            <section className="aw-panel">
              <div className="aw-panel-heading"><div><span className="aw-eyebrow">TALENT INBOX</span><h2>All applications</h2><p>Review candidate profiles, resumes and application progress.</p></div><span className="aw-app-total">{applicationTotal} total</span></div>
              <div className="aw-toolbar">
                <label className="aw-search"><Search size={16} /><input value={careerSearch} onChange={(event) => { setCareerSearch(event.target.value); setCareerPage(1); }} placeholder="Search name, email or application ID" /></label>
                <label className="aw-filter"><span>Status</span><select value={careerStatusFilter} onChange={(event) => { setCareerStatusFilter(event.target.value); setCareerPage(1); }}><option value="ALL">All statuses</option>{careerStatusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label>
              </div>
              {pageError && <div className="aw-form-alert" role="alert">{pageError}</div>}
              <div className="aw-table-wrap"><table className="aw-table aw-career-table"><thead><tr><th>Applicant</th><th>Position</th><th>Experience</th><th>Received</th><th>Status</th><th><span className="aw-sr-only">Action</span></th></tr></thead><tbody>
                {isApplicationLoading ? <tr><td colSpan="6" className="aw-no-results">Loading applications…</td></tr> : applications.length ? applications.map((item) => <tr key={item.id}>
                  <td><div className="aw-person"><span className="aw-person-avatar">{initials(item.name)}</span><span><b>{item.name}</b><small>{item.email}</small></span></div></td>
                  <td><span className="aw-subject">{item.position || 'Not specified'}</span><small className="aw-org">{item.qualification}</small></td>
                  <td>{item.experience_years}y {item.experience_months}m</td>
                  <td><span className="aw-date">{formatDate(item.created_at)}</span><small className="aw-org">{formatTime(item.created_at)}</small></td>
                  <td><span className={`aw-status aw-career-status-${String(item.status).toLowerCase()}`}>{careerStatusLabels[item.status] || item.status}</span></td>
                  <td><button className="aw-view-button" onClick={() => openApplicationDetails(item.id)}>Review <ArrowUpRight size={14} /></button></td>
                </tr>) : <tr><td colSpan="6" className="aw-no-results">{pageError ? 'Unable to load applications.' : 'No applications match your search.'}</td></tr>}
              </tbody></table></div>
              <div className="aw-table-footer"><span>Showing {applicationTotal ? (careerPage - 1) * 20 + 1 : 0}–{Math.min(careerPage * 20, applicationTotal)} of {applicationTotal} applications</span><div className="aw-pagination"><button disabled={careerPage <= 1 || isApplicationLoading} onClick={() => setCareerPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={16} /></button><span>{careerPage} / {Math.max(applicationTotalPages, 1)}</span><button disabled={careerPage >= applicationTotalPages || isApplicationLoading || applicationTotalPages === 0} onClick={() => setCareerPage((value) => Math.min(applicationTotalPages, value + 1))} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
            </section>
          ) : (
            <section className="aw-panel">
              <div className="aw-panel-heading"><div><span className="aw-eyebrow">INBOX</span><h2>{isQueries ? 'All enquiries' : 'Recent enquiries'}</h2><p>{isQueries ? 'Search, filter and review client submissions.' : 'The latest submissions requiring your attention.'}</p></div>{!isQueries && <Link className="aw-text-link" to="/admin/queries">View all enquiries <ArrowUpRight size={15} /></Link>}</div>
              <div className="aw-toolbar">
                <label className="aw-search"><Search size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, subject or ID" /></label>
                <label className="aw-filter"><span>Status</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}><option value="ALL">All statuses</option>{statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><ChevronDown size={14} /></label>
              </div>
              {pageError && <div className="aw-form-alert" role="alert">{pageError}</div>}
              <div className="aw-table-wrap"><table className="aw-table"><thead><tr><th>Enquiry</th><th>Area of enquiry</th><th>Received</th><th>Status</th><th><span className="aw-sr-only">Action</span></th></tr></thead><tbody>
                {isLoading ? <tr><td colSpan="5" className="aw-no-results">Loading enquiries…</td></tr> : queries.length ? queries.map((item) => <tr key={item.id}>
                  <td><div className="aw-person"><span className="aw-person-avatar">{initials(item.name)}</span><span><b>{item.name}</b><small>{item.email}</small></span></div></td>
                  <td><span className="aw-subject">{item.subject || '—'}</span><small className="aw-org">{item.organization || item.city || ''}</small></td>
                  <td><span className="aw-date">{formatDate(item.created_at)}</span><small className="aw-org">{formatTime(item.created_at)}</small></td>
                  <td><StatusPill status={item.status} /></td>
                  <td><button className="aw-view-button" onClick={() => openDetails(item.id)}>View details <ArrowUpRight size={14} /></button></td>
                </tr>) : <tr><td colSpan="5" className="aw-no-results">{pageError ? 'Unable to load enquiries.' : 'No enquiries match your search.'}</td></tr>}
              </tbody></table></div>
              <div className="aw-table-footer"><span>Showing {total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)} of {total} enquiries</span><div className="aw-pagination"><button disabled={page <= 1 || isLoading} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={16} /></button><span>{page} / {Math.max(totalPages, 1)}</span><button disabled={page >= totalPages || isLoading || totalPages === 0} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
            </section>
          )}
          <footer className="aw-footer"><span>© {new Date().getFullYear()} S. Sandeep & Associates</span><span><ShieldCheck size={13} /> Internal workspace · Live data</span></footer>
        </div>
      </main>
      <QueryDetail query={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} isUpdating={isUpdating} error={detailError} />
      <CareerApplicationDetail application={selectedApplication} onClose={() => setSelectedApplication(null)} onStatusChange={updateCareerStatus} onDownload={downloadResume} isUpdating={isCareerUpdating} isDownloading={isResumeDownloading} error={detailError} />
    </div>
  );
}
