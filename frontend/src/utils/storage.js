/**
 * Read a JSON array from browser storage without allowing storage failures to
 * interrupt the public experience.
 *
 * @param {string} key Browser storage key to read.
 * @returns {Array<object>} Parsed array, or an empty array when unavailable or invalid.
 */
function readArray(key) {
  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    return [];
  }
}

/**
 * Write a JSON array to browser storage without surfacing storage quota or
 * privacy-mode failures to the UI.
 *
 * @param {string} key Browser storage key to write.
 * @param {Array<object>} records Records to persist.
 * @returns {boolean} Whether the records were successfully stored.
 */
function writeArray(key, records) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.isArray(records) ? records : []));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Retrieve locally persisted posts in a fail-safe form.
 *
 * @returns {Array<object>} Post records or an empty array.
 */
export function getPosts() {
  return readArray('writespace_posts');
}

/**
 * Persist the supplied post records when browser storage is available.
 *
 * @param {Array<object>} posts Post records to persist.
 * @returns {boolean} Whether the save succeeded.
 */
export function savePosts(posts) {
  return writeArray('writespace_posts', posts);
}

/**
 * Retrieve locally persisted users in a fail-safe form.
 *
 * @returns {Array<object>} User records or an empty array.
 */
export function getUsers() {
  return readArray('writespace_users');
}

/**
 * Persist the supplied user records when browser storage is available.
 *
 * @param {Array<object>} users User records to persist.
 * @returns {boolean} Whether the save succeeded.
 */
export function saveUsers(users) {
  return writeArray('writespace_users', users);
}
