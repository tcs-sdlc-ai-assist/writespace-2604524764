/**
 * Read the current browser session without allowing malformed storage to grant access.
 *
 * @returns {object|null} A valid session object, or null when unavailable or invalid.
 */
export function getSession() {
  try {
    const rawSession = window.localStorage.getItem('writespace_session');

    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);
    return session && typeof session === 'object' && !Array.isArray(session) ? session : null;
  } catch (error) {
    return null;
  }
}

/**
 * Persist a session object when browser storage is available.
 *
 * @param {object} session Session details to persist.
 * @returns {boolean} Whether the session was successfully stored.
 */
export function setSession(session) {
  try {
    if (!session || typeof session !== 'object' || Array.isArray(session)) {
      return false;
    }

    window.localStorage.setItem('writespace_session', JSON.stringify(session));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Remove the current browser session without surfacing storage failures.
 *
 * @returns {boolean} Whether the session was successfully removed.
 */
export function clearSession() {
  try {
    window.localStorage.removeItem('writespace_session');
    return true;
  } catch (error) {
    return false;
  }
}
