import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

/**
 * Format a post date for the long-form reading view.
 *
 * @param {string} dateValue Stored ISO date value.
 * @returns {string} Localized date or an empty fallback.
 */
function formatDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

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
 * Render one stored blog and expose management controls only to its owner or an administrator.
 *
 * @returns {JSX.Element} Blog reading view or the missing-post state.
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const post = getPosts().find((candidate) => candidate.id === id);

  /**
   * Confirm and persist the removal of the current post before returning to the list.
   *
   * @returns {void}
   */
  function handleDelete() {
    if (!post || !window.confirm('Delete this post?')) {
      return;
    }

    const remainingPosts = getPosts().filter((candidate) => candidate.id !== post.id);

    if (savePosts(remainingPosts)) {
      navigate('/blogs');
    }
  }

  if (!post) {
    return <p className="py-16 text-center text-lg text-slate-600">Post not found</p>;
  }

  const mayManage = canManagePost(post, session);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/blogs"
        className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors duration-150 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700"
      >
        Back to blogs
      </Link>
      <header className="mt-8 border-b border-slate-200 pb-8">
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Avatar name={post.authorName || 'WriteSpace writer'} role={post.authorRole || 'user'} />
          <time className="text-sm text-slate-500" dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
      </header>
      <div className="max-w-[72ch] whitespace-pre-wrap py-10 text-lg leading-8 text-slate-700">{post.content}</div>
      {mayManage && (
        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <Link
            to={`/edit/${post.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors duration-150 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2"
          >
            Edit post
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
          >
            Delete post
          </button>
        </div>
      )}
    </article>
  );
}
