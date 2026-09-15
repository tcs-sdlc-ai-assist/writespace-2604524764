import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

/**
 * Render the local WriteSpace account creation form.
 *
 * @returns {JSX.Element} Registration page or a redirect for an active session.
 */
export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const existingSession = getSession();

  if (existingSession) {
    return <Navigate to={existingSession.role === 'Admin' ? '/admin' : '/blogs'} replace />;
  }

  /**
   * Validate and store a new local user, then start their session.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submitted form event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
      setError('Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = getUsers();
    const normalizedUsername = username.trim();
    const usernameExists = normalizedUsername === 'admin' || users.some((user) => user.username === normalizedUsername);

    if (usernameExists) {
      setError('That username is already in use.');
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      username: normalizedUsername,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    if (!saveUsers([...users, user])) {
      setError('We could not save your account. Please try again.');
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
        <Link to="/" className="text-xl font-extrabold tracking-tight text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">WriteSpace</Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-violet-700">Your writing home</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
        <p className="mt-3 text-slate-600">Start a private, local space for your next thought.</p>
        <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="register-display-name" className="block text-sm font-semibold text-slate-800">Display name</label>
            <input id="register-display-name" name="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label htmlFor="register-username" className="block text-sm font-semibold text-slate-800">Username</label>
            <input id="register-username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-semibold text-slate-800">Password</label>
            <input id="register-password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          <div>
            <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-slate-800">Confirm password</label>
            <input id="register-confirm-password" name="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200" required />
          </div>
          {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-indigo-600 px-5 py-3 font-bold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Create account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="font-bold text-indigo-700 underline underline-offset-4">Sign in</Link></p>
      </section>
    </main>
  );
}
