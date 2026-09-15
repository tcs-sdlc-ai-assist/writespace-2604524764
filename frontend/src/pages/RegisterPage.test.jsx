import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Render the application at the registration route.
 *
 * @returns {object} Testing Library render result.
 */
function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <App />
    </MemoryRouter>,
  );
}

/**
 * Complete the required registration fields.
 *
 * @param {ReturnType<typeof userEvent.setup>} user User-event controller.
 * @param {{ displayName?: string, username?: string, password?: string, confirmation?: string }} values Registration details.
 * @returns {Promise<void>} Completion signal after fields receive their values.
 */
async function completeRegistration(user, values = {}) {
  await user.type(screen.getByLabelText('Display name'), values.displayName || 'Jane Writer');
  await user.type(screen.getByLabelText('Username'), values.username || 'jane');
  await user.type(screen.getByLabelText('Password'), values.password || 'secret');
  await user.type(screen.getByLabelText('Confirm password'), values.confirmation || values.password || 'secret');
}

describe('RegisterPage', () => {
  it('persists a new user and starts a user session after successful registration', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await completeRegistration(user);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByRole('heading', { name: 'All blogs' })).toBeInTheDocument();
    const users = JSON.parse(window.localStorage.getItem('writespace_users'));
    const session = JSON.parse(window.localStorage.getItem('writespace_session'));
    expect(users).toHaveLength(1);
    expect(users[0]).toMatchObject({ displayName: 'Jane Writer', username: 'jane', password: 'secret', role: 'user' });
    expect(users[0].id).toBeTruthy();
    expect(users[0].createdAt).toBeTruthy();
    expect(session).toMatchObject({ userId: users[0].id, username: 'jane', displayName: 'Jane Writer', role: 'user' });
  });

  it('requires every registration field', async () => {
    const user = userEvent.setup();
    renderRegisterPage();

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please complete all fields.');
  });

  it('rejects mismatched passwords and usernames already taken by the admin or a local user', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'existing', username: 'jane', displayName: 'Existing Jane', role: 'user' }]));
    renderRegisterPage();

    await completeRegistration(user, { password: 'one', confirmation: 'two' });
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.');

    await user.clear(screen.getByLabelText('Password'));
    await user.clear(screen.getByLabelText('Confirm password'));
    await user.type(screen.getByLabelText('Password'), 'same');
    await user.type(screen.getByLabelText('Confirm password'), 'same');
    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('That username is already in use.');

    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'jane');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(screen.getByRole('alert')).toHaveTextContent('That username is already in use.');
    expect(JSON.parse(window.localStorage.getItem('writespace_users'))).toEqual([{ id: 'existing', username: 'jane', displayName: 'Existing Jane', role: 'user' }]);
    expect(window.localStorage.getItem('writespace_session')).toBeNull();
  });

  it('shows an error without creating a session when account storage fails', async () => {
    const user = userEvent.setup();
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    renderRegisterPage();

    await completeRegistration(user);
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByRole('alert')).toHaveTextContent('We could not save your account. Please try again.');
    expect(window.localStorage.getItem('writespace_users')).toBeNull();
    expect(window.localStorage.getItem('writespace_session')).toBeNull();
    setItem.mockRestore();
  });
});
