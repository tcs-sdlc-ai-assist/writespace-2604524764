import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import AdminDashboard from './AdminDashboard';

function renderDashboard() {
  return render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
}

describe('AdminDashboard', () => {
  it('shows all requested stats including the logical default admin', () => {
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'staff', displayName: 'Staff', username: 'staff', role: 'Admin', createdAt: '2024-01-02T00:00:00.000Z' }, { id: 'writer', displayName: 'Writer', username: 'writer', role: 'user', createdAt: '2024-01-03T00:00:00.000Z' }]));
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'post', title: 'Post', createdAt: '2024-01-03T00:00:00.000Z' }]));
    renderDashboard();
    expect(screen.getByText('Total Posts').nextElementSibling).toHaveTextContent('1');
    expect(screen.getByText('Total Users').nextElementSibling).toHaveTextContent('3');
    expect(screen.getByText('Total Admins').nextElementSibling).toHaveTextContent('2');
    expect(screen.getByText('Total users (non-admin)').nextElementSibling).toHaveTextContent('1');
  });

  it('confirms and persists deletion of a recent post', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'remove', title: 'Remove me', authorName: 'Admin', createdAt: '2024-01-03T00:00:00.000Z' }]));
    renderDashboard();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))).toEqual([]);
  });

  it('redirects a non-admin from the dashboard route', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));
    render(<MemoryRouter initialEntries={['/admin']}><Routes><Route path="*" element={<App />} /></Routes></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'All blogs' })).toBeInTheDocument();
  });
});
