import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import UserManagement from './UserManagement';

function renderUsers() {
  window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'current', username: 'current', displayName: 'Current Admin', role: 'Admin' }));
  return render(<MemoryRouter><UserManagement /></MemoryRouter>);
}

describe('UserManagement', () => {
  it('creates a local account with the selected role and timestamps it', async () => {
    const user = userEvent.setup();
    renderUsers();
    await user.type(screen.getByLabelText('Display name'), 'New Admin');
    await user.type(screen.getByLabelText('Username'), 'newadmin');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.selectOptions(screen.getByLabelText('Role'), 'Admin');
    await user.click(screen.getByRole('button', { name: 'Create User' }));
    const users = JSON.parse(window.localStorage.getItem('writespace_users'));
    expect(users[0]).toMatchObject({ displayName: 'New Admin', username: 'newadmin', password: 'secret', role: 'Admin' });
    expect(users[0].id).toEqual(expect.any(String));
    expect(users[0].createdAt).toEqual(expect.any(String));
  });

  it('rejects incomplete forms and usernames already used by the default admin', async () => {
    const user = userEvent.setup();
    renderUsers();
    await user.click(screen.getByRole('button', { name: 'Create User' }));
    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required.');
    await user.type(screen.getByLabelText('Display name'), 'Imposter');
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Create User' }));
    expect(screen.getByRole('alert')).toHaveTextContent('That username is already in use.');
  });

  it('protects the default and current account while deleting an eligible account after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'current', displayName: 'Current Admin', username: 'current', role: 'Admin', createdAt: '2024-01-01T00:00:00.000Z' }, { id: 'eligible', displayName: 'Eligible', username: 'eligible', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' }]));
    renderUsers();
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toHaveAttribute('title', 'Default admin cannot be deleted.');
    expect(screen.getAllByRole('button', { name: 'Delete' })[1]).toBeDisabled();
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[2]);
    expect(screen.queryByText('Eligible')).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('writespace_users'))).toHaveLength(1);
  });
});
