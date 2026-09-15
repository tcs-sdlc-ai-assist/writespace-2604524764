import { useState } from 'react';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

const defaultAdmin = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  role: 'Admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

/**
 * Render Administrator account creation and protected local account management.
 *
 * @returns {JSX.Element} User administration page.
 */
export default function UserManagement() {
  const session = getSession();
  const [users, setUsers] = useState(() => getUsers());
  const [form, setForm] = useState({ displayName: '', username: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const displayedUsers = [defaultAdmin, ...users];

  /**
   * Persist a valid local account with a unique username.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Submitted form event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();
    const displayName = form.displayName.trim();
    const username = form.username.trim();
    setError('');
    setStatus('');

    if (!displayName || !username || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }

    if (username === 'admin' || users.some((user) => user.username === username)) {
      setError('That username is already in use.');
      return;
    }

    const user = { id: crypto.randomUUID(), displayName, username, password: form.password, role: form.role, createdAt: new Date().toISOString() };
    const updatedUsers = [...users, user];
    if (!saveUsers(updatedUsers)) {
      setError('We could not save this user. Please try again.');
      return;
    }

    setUsers(updatedUsers);
    setForm({ displayName: '', username: '', password: '', role: 'user' });
    setStatus(`${displayName} was created.`);
  }

  /**
   * Confirm and persist deletion for eligible local accounts only.
   *
   * @param {object} user Candidate local user.
   * @returns {void}
   */
  function handleDelete(user) {
    if (user.id === 'admin' || user.id === session?.userId || !window.confirm(`Delete ${user.displayName}?`)) {
      return;
    }

    const updatedUsers = users.filter((candidate) => candidate.id !== user.id);
    if (saveUsers(updatedUsers)) {
      setUsers(updatedUsers);
      setStatus(`${user.displayName} was deleted.`);
    }
  }

  return (
    <section aria-labelledby="users-heading">
      <div className="border-b border-slate-200 pb-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-violet-700">Administration</p>
        <h1 id="users-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">User management</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Create local accounts and maintain access to WriteSpace.</p>
      </div>

      <form
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-lg font-bold text-slate-900">Create User</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-sm font-semibold text-slate-800">
            Display name
            <input
              aria-label="Display name"
              value={form.displayName}
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Username
            <input
              aria-label="Username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Password
            <input
              aria-label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Role
            <select
              aria-label="Role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="user">user</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}
        {status && (
          <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {status}
          </p>
        )}
        <button
          type="submit"
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Create User
        </button>
      </form>

      <section
        className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-labelledby="accounts-heading"
      >
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 id="accounts-heading" className="font-bold text-slate-900">Accounts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">User</th>
                <th scope="col" className="hidden px-4 py-3 sm:table-cell">Username</th>
                <th scope="col" className="hidden px-4 py-3 sm:table-cell">Role</th>
                <th scope="col" className="hidden px-4 py-3 md:table-cell">Created</th>
                <th scope="col" className="px-4 py-3 text-right sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === session?.userId}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
