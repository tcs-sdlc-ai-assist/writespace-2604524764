import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { getPosts, getUsers, savePosts } from '../utils/storage';

/**
 * Render the administrator overview with persisted post management.
 *
 * @returns {JSX.Element} Admin dashboard.
 */
export default function AdminDashboard() {
  const [posts, setPosts] = useState(() => getPosts());
  const users = getUsers();
  const latestPosts = [...posts].sort((firstPost, secondPost) => new Date(secondPost.createdAt) - new Date(firstPost.createdAt)).slice(0, 5);
  const totalAdmins = users.filter((user) => user.role === 'Admin').length + 1;
  const totalUsers = users.length + 1;
  const nonAdminUsers = users.filter((user) => user.role !== 'Admin').length;

  /**
   * Confirm and persist removal of an administrator-managed post.
   *
   * @param {string} postId Stored post identifier.
   * @returns {void}
   */
  function handleDelete(postId) {
    if (!window.confirm('Delete this post?')) {
      return;
    }

    const updatedPosts = posts.filter((post) => post.id !== postId);
    if (savePosts(updatedPosts)) {
      setPosts(updatedPosts);
    }
  }

  return (
    <section aria-labelledby="admin-dashboard-heading">
      <header className="rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-8 text-white shadow-lg sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-100">Administration</p>
        <h1 id="admin-dashboard-heading" className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">WriteSpace overview</h1>
        <p className="mt-3 max-w-2xl text-indigo-100">Manage the local writing community and keep its latest work in view.</p>
      </header>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Posts" value={posts.length} />
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Admins" value={totalAdmins} />
        <StatCard label="Total users (non-admin)" value={nonAdminUsers} />
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
          <p className="mt-1 text-sm text-slate-600">Move directly to the tools you need.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/write" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Write New Post</Link>
          <Link to="/users" className="rounded-lg border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-800 transition-colors duration-150 hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Manage Users</Link>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="latest-posts-heading">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-violet-700">Content</p>
            <h2 id="latest-posts-heading" className="mt-1 text-2xl font-extrabold text-slate-900">Latest posts</h2>
          </div>
          <span className="text-sm text-slate-500">Five most recent</span>
        </div>
        {latestPosts.length === 0 ? (
          <p className="py-10 text-center text-slate-600">No posts have been published yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {latestPosts.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{post.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{post.authorName || 'Unknown author'} · {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3">
                  <Link to={`/edit/${post.id}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors duration-150 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">Edit</Link>
                  <button type="button" onClick={() => handleDelete(post.id)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
