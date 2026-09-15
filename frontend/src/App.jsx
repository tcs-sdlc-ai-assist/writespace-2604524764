import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getSession } from './utils/auth';

/**
 * Render a minimal authenticated destination while feature-specific pages are added later.
 *
 * @param {{ children: React.ReactNode }} props Component properties.
 * @returns {JSX.Element} Authenticated application shell and placeholder content.
 */
function AuthenticatedPlaceholder({ children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar session={session} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

AuthenticatedPlaceholder.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Provide public identity routes and fail-closed authenticated placeholders until
 * the dedicated blog and administration feature slices replace them.
 *
 * @returns {JSX.Element} Application route tree.
 */
export default function App() {
  const session = getSession();
  const protectedPaths = ['/blogs', '/blog/:id', '/write', '/edit/:id'];

  return (
    <Routes>
      <Route path="/" element={<LandingPage session={session} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {protectedPaths.map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <AuthenticatedPlaceholder>
                <p className="text-lg font-semibold">Protected content</p>
              </AuthenticatedPlaceholder>
            </ProtectedRoute>
          }
        />
      ))}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AuthenticatedPlaceholder>
              <p className="text-lg font-semibold">Admin dashboard</p>
            </AuthenticatedPlaceholder>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requireAdmin>
            <AuthenticatedPlaceholder>
              <p className="text-lg font-semibold">User management</p>
            </AuthenticatedPlaceholder>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
