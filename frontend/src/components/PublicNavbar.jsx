import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

/**
 * Render public navigation with a guest conversion path or a session-aware
 * dashboard path.
 *
 * @param {{ session: object|null }} props Component properties.
 * @returns {JSX.Element} Sticky public navigation bar.
 */
export default function PublicNavbar({ session }) {
  const dashboardPath = session?.role === 'Admin' ? '/admin' : '/blogs';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
      <nav
        aria-label="Public navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
      >
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          WriteSpace
        </Link>
        {session ? (
          <div className="flex items-center gap-3">
            <Avatar name={session.displayName || session.username} role={session.role} />
            <Link
              to={dashboardPath}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link
              to="/login"
              className="rounded-full px-3 py-2 text-slate-700 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-indigo-600 px-4 py-2 text-white shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

PublicNavbar.propTypes = {
  session: PropTypes.shape({
    displayName: PropTypes.string,
    role: PropTypes.string,
    username: PropTypes.string,
  }),
};

PublicNavbar.defaultProps = {
  session: null,
};
