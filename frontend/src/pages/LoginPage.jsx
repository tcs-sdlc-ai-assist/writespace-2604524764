import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

const adminSession = {
  userId: 'admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'Admin',
};

/**
 * Render the local WriteSpace sign-in form.
 *
 * @returns {JSX.Element} Login page or a redirect for an active session.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const existingSession = getSession();

  if (existingSession) {
    return <Navigate to={existingSession.role === 'Admin' ? '/admin' : '/blogs'} replace />;
  }

  /**
   * Validate local credentials, persist the resulting session, and continue to the correct workspace.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submitted form event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin') {
      setSession(adminSession);
      navigate('/admin');
      return;
    }

    const user = getUsers().find((candidate) => candidate.username === username && candidate.password === password);

    if (!user) {
      setError('Invalid username or password.');
      return;
    }

    setSession({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });
    navigate('/blogs');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          WriteSpace
        </Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-violet-700">Welcome back</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Login to your space</h1>
        <p className="mt-3 text-slate-600">Use your local WriteSpace account to continue writing.</p>
        <p className="mt-5 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-800">Demo admin: <strong>admin</strong> / <strong>admin</strong></p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="login-username" className="block text-sm font-semibold text-slate-800">Username</label>
            <input id="login-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800">Password</label>
            <input id="login-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-indigo-600 px-5 py-3 font-bold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">New to WriteSpace? <Link to="/register" className="font-bold text-indigo-700 underline underline-offset-4">Create an account</Link></p>
      </section>
    </main>
  );
}
