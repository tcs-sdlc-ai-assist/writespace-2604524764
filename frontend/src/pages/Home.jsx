import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { getSession } from '../utils/auth';
import { getPosts } from '../utils/storage';

/**
 * Determine whether the active session may manage a post.
 *
 * @param {object} post Stored post record.
 * @param {object|null} session Active local session.
 * @returns {boolean} Whether the session owns the post or is an administrator.
 */
function canManagePost(post, session) {
  return Boolean(session && (session.role === 'Admin' || post.authorId === session.userId));
}

/**
 * Render newest-first locally persisted blogs for the signed-in writer.
 *
 * @returns {JSX.Element} Blog list with author-aware editing controls.
 */
export default function Home() {
  const session = getSession();
  const posts = getPosts().sort((firstPost, secondPost) => {
    return new Date(secondPost.createdAt).getTime() - new Date(firstPost.createdAt).getTime();
  });

  return (
    <section aria-labelledby="blogs-heading">
      <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Your reading room</p>
          <h1 id="blogs-heading" className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">All blogs</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Ideas and reflections from the WriteSpace community.</p>
        </div>
        <Link
          to="/write"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
        >
          Write a blog
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-slate-600">No blogs yet. Be the first to write one!</p>
          <Link
            to="/write"
            className="mt-5 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            Write a blog
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <div key={post.id} className="flex flex-col gap-3">
              <BlogCard post={post} index={index} showAuthor />
              {canManagePost(post, session) && (
                <Link
                  to={`/edit/${post.id}`}
                  className="w-fit text-sm font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
                >
                  Edit
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
