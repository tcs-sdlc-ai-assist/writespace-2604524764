import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clearSession } from '../utils/auth';
import Avatar from './Avatar';

/**
 * Render the authenticated WriteSpace navigation and session controls.
 *
 * @param {{ session: object }} props Component properties.
 * @returns {JSX.Element} Responsive authenticated navigation bar.
 */
export default function Navbar({ session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = session.role === 'Admin';
  const links = isAdmin
    ? [
        { label: 'All Blogs', to: '/blogs' },
        { label: 'Write', to: '/write' },
        { label: 'Users', to: '/users' },
      ]
    : [
        { label: 'All Blogs', to: '/blogs' },
        { label: 'Write', to: '/write' },
      ];

  /**
   * End the local session and return the visitor to the public landing page.
   *
   * @returns {void}
   */
  function handleLogout() {
    clearSession();
    setIsAccountOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  }

  /**
   * Close the compact navigation after selecting a route.
   *
   * @returns {void}
   */
  function closeMenu() {
    setIsMenuOpen(false);
  }

  const navLinks = links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={closeMenu}
      className={({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
        isActive ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav aria-label="Authenticated navigation" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to={isAdmin ? '/admin' : '/blogs'}
            className="text-xl font-extrabold tracking-tight text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            WriteSpace
          </Link>
          <div className="hidden items-center gap-1 md:flex">{navLinks}</div>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-expanded={isAccountOpen}
              aria-haspopup="menu"
              aria-label="Open account menu"
              onClick={() => setIsAccountOpen((isOpen) => !isOpen)}
              className="rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <Avatar name={session.displayName || session.username} role={session.role} compact />
            </button>
            {isAccountOpen && (
              <div role="menu" className="absolute right-4 top-14 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg sm:right-6">
                <p className="px-3 py-2 text-sm font-semibold text-slate-800">{session.displayName || session.username}</p>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 md:hidden"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-slate-100 py-3 md:hidden">
            <div className="flex flex-col gap-1">{navLinks}</div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <Avatar name={session.displayName || session.username} role={session.role} />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  session: PropTypes.shape({
    displayName: PropTypes.string,
    role: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};
