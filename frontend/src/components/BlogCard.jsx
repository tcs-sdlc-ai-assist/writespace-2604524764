import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

/**
 * Format a stored date for the compact public post preview.
 *
 * @param {string} dateValue Stored ISO date string.
 * @returns {string} Human-friendly date or an empty fallback.
 */
function formatDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Show a local post summary that navigates through the application route guard.
 *
 * @param {{ post: object, index: number, showAuthor: boolean }} props Component properties.
 * @returns {JSX.Element} Accessible post preview card.
 */
export default function BlogCard({ post, index = 0, showAuthor = true }) {
  const accentClasses = ['border-indigo-500', 'border-violet-500', 'border-pink-500', 'border-teal-500'];
  const excerpt = typeof post.content === 'string' ? post.content.slice(0, 120) : '';
  const dateLabel = formatDate(post.createdAt);

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-slate-200 border-t-4 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${
        accentClasses[index % accentClasses.length]
      }`}
    >
      <p className="text-sm text-slate-500">{dateLabel}</p>
      <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-800">
        <Link
          to={`/blog/${post.id}`}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          {post.title || 'Untitled post'}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {excerpt}
        {post.content && post.content.length > 120 ? '…' : ''}
      </p>
      {showAuthor && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <Avatar name={post.authorName || 'WriteSpace writer'} role={post.authorRole || 'user'} />
        </div>
      )}
      <Link
        to={`/blog/${post.id}`}
        className="mt-5 inline-flex w-fit text-sm font-semibold text-indigo-700 underline decoration-indigo-200 underline-offset-4 transition-colors duration-200 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      >
        Read post
      </Link>
    </article>
  );
}

BlogCard.propTypes = {
  index: PropTypes.number,
  post: PropTypes.shape({
    authorName: PropTypes.string,
    authorRole: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  }).isRequired,
  showAuthor: PropTypes.bool,
};

