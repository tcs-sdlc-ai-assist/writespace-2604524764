import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

/**
 * Render the route tree at a location suitable for authentication behavior tests.
 *
 * @param {string} route Initial location.
 * @returns {object} Testing Library render result.
 */
function renderApp(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('signs in the seeded administrator and persists the required session', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('heading', { name: 'WriteSpace overview' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('writespace_session'))).toEqual({
      userId: 'admin', username: 'admin', displayName: 'Admin', role: 'Admin',
    });
  });

  it('shows the exact invalid-credentials message without creating a session', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Username'), 'wrong');
    await user.type(screen.getByLabelText('Password'), 'credentials');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password.');
    expect(window.localStorage.getItem('writespace_session')).toBeNull();
  });

  it('redirects guests from protected routes to login', () => {
    renderApp('/write');

    expect(screen.getByRole('heading', { name: 'Login to your space' })).toBeInTheDocument();
  });
});
