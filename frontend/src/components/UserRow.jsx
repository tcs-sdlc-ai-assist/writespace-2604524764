import PropTypes from 'prop-types';
import Avatar from './Avatar';

/**
 * Render a responsive user record with its protected or eligible delete action.
 *
 * @param {{ user: object, isCurrentUser: boolean, onDelete: function }} props User row properties.
 * @returns {JSX.Element} User table row and mobile-friendly content.
 */
export default function UserRow({ user, isCurrentUser, onDelete }) {
  const isDefaultAdmin = user.id === 'admin';
  const protectedUser = isDefaultAdmin || isCurrentUser;
  const deleteTitle = isDefaultAdmin ? 'Default admin cannot be deleted.' : isCurrentUser ? 'You cannot delete your own account.' : undefined;

  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Avatar name={user.displayName} role={user.role} compact />
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{user.displayName}</p>
            <p className="text-sm text-slate-500 sm:hidden">@{user.username} · {user.role}</p>
            <p className="text-xs text-slate-400 sm:hidden">Created {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-4 text-sm text-slate-600 sm:table-cell">@{user.username}</td>
      <td className="hidden px-4 py-4 sm:table-cell">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.role === 'Admin' ? 'bg-violet-100 text-violet-800' : 'bg-indigo-100 text-indigo-800'}`}>
          {user.role}
        </span>
      </td>
      <td className="hidden px-4 py-4 text-sm text-slate-500 md:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-4 text-right sm:px-6">
        <button
          type="button"
          title={deleteTitle}
          disabled={protectedUser}
          onClick={() => onDelete(user)}
          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};
