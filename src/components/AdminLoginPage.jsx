import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, ShieldCheck } from 'lucide-react';
import { adminApi } from './admin-api.js';
import './admin-workspace.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);


  useEffect(() => {
  let active = true;

  adminApi('/api/v1/admin/me')
    .then(() => {
      if (active) {
        navigate('/admin/dashboard', { replace: true });
      }
    })
    .catch(() => {
      // No valid session. Show the login form.
    })
    .finally(() => {
      if (active) {
        setIsCheckingSession(false);
      }
    });

  return () => {
    active = false;
  };
}, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      await adminApi('/api/v1/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.status === 401
          ? 'The email or password is incorrect.'
          : err.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  if (isCheckingSession) {
    return (
      <div className="aw-loading-screen">
        <span className="aw-loading-spinner" />
        Verifying administrator session…
      </div>
    );
  }
  return (
    <main className="adminlogin">
      <div className="admin-top">
        <Link className="brand" to="/">
          <span className="brand-mark">CS</span>
          <span><b>S. SANDEEP <i>&</i> ASSOCIATES</b><small>COMPANY SECRETARIES</small></span>
        </Link>
        <Link to="/" className="textlink"><ArrowLeft size={14} /> Back to website</Link>
      </div>
      <section>
        <span className="lockicon"><LockKeyhole size={25} /></span>
        <span className="eyebrow">RESTRICTED ACCESS</span>
        <h1>Admin sign in</h1>
        <p>For authorised administrators to review enquiries and career applications.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Admin email
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@yourfirm.com"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>
          {error && <p className="aw-form-alert" role="alert">{error}</p>}
          <button className="btn primary full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in securely'} <ShieldCheck size={16} />
          </button>
        </form>
        <small>Secure administrator access · Session expires after inactivity</small>
      </section>
    </main>
  );
}
