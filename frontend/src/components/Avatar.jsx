import PropTypes from 'prop-types';

/**
 * Render the role-specific avatar visual required by WriteSpace.
 *
 * @param {{ role: string }} props Component properties.
 * @returns {JSX.Element} Static role avatar.
 */
export function getAvatar(role) {
  const isAdmin = role === 'Admin';

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-lg text-white ${
        isAdmin ? 'bg-violet-600' : 'bg-indigo-500'
      }`}
    >
      {isAdmin ? '👑' : '📖'}
    </span>
  );
}

/**
 * Present a named person with their role-specific avatar.
 *
 * @param {{ name: string, role: string, compact: boolean }} props Component properties.
 * @returns {JSX.Element} Avatar and identity label.
 */
export default function Avatar({ name, role, compact }) {
  return (
    <span className="inline-flex items-center gap-2">
      {getAvatar(role)}
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-800">{name}</span>
          <span className="block text-xs text-slate-500">{role}</span>
        </span>
      )}
    </span>
  );
}

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

Avatar.defaultProps = {
  compact: false,
};
