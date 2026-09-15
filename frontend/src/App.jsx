import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

/**
 * Read the temporary local session shape without allowing malformed browser
 * data to grant access to a protected placeholder route.
 *
 * @returns {object|null} Current session when it is a valid object.
 */
function getSession() {
  try {
    const rawSession = window.localStorage.getItem('writespace_session');

    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);
    return session && typeof session === 'object' ? session : null;
  } catch (error) {
    return null;
  }
}

/**
 * Provide interim public routes and fail-closed placeholders until identity and
 * blog pages replace them in their dedicated feature slices.
 *
 * @returns {JSX.Element} Application route tree.
 */
export default function App() {
  const session = getSession();
  const protectedPaths = ['/blogs', '/blog/:id', '/write', '/edit/:id'];

  return (
    <Routes>
      <Route path="/" element={<LandingPage session={session} />} />
      <Route path="/login" element={<p className="p-8 text-slate-800">Login</p>} />
      <Route path="/register" element={<p className="p-8 text-slate-800">Register</p>} />
      {protectedPaths.map((path) => (
        <Route
          key={path}
          path={path}
          element={session ? <p className="p-8 text-slate-800">Protected content</p> : <Navigate to="/login" replace />}
        />
      ))}
      <Route
        path="/admin"
        element={
          !session ? (
            <Navigate to="/login" replace />
          ) : session.role === 'Admin' ? (
            <p className="p-8 text-slate-800">Admin dashboard</p>
          ) : (
            <Navigate to="/blogs" replace />
          )
        }
      />
      <Route
        path="/users"
        element={
          !session ? (
            <Navigate to="/login" replace />
          ) : session.role === 'Admin' ? (
            <p className="p-8 text-slate-800">User management</p>
          ) : (
            <Navigate to="/blogs" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
