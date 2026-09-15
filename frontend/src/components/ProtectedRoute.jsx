import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Restrict route content to signed-in users and optionally to administrators.
 *
 * @param {{ children: React.ReactNode, requireAdmin?: boolean }} props Component properties.
 * @returns {JSX.Element} Guarded child content or an appropriate redirect.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && session.role !== 'Admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};
