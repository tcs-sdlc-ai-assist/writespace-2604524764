import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Home from './Home';

/**
 * Render the blog list inside its routing context.
 *
 * @returns {object} Testing Library render result.
 */
function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home', () => {
  it('shows the exact empty message and a writing call to action', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));

    renderHome();

    expect(screen.getByText('No blogs yet. Be the first to write one!')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Write a blog' })[0]).toHaveAttribute('href', '/write');
  });

  it('renders stored blogs newest first', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'old', title: 'Old thought', content: 'Older', createdAt: '2024-01-01T00:00:00.000Z', authorId: 'writer' },
      { id: 'new', title: 'New thought', content: 'Newest', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer' },
      { id: 'middle', title: 'Middle thought', content: 'Middle', createdAt: '2024-02-01T00:00:00.000Z', authorId: 'writer' },
    ]));

    renderHome();

    expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'New thought', 'Middle thought', 'Old thought',
    ]);
  });

  it('shows edit only for the author or an administrator', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'mine', title: 'My post', content: 'Owned', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer' },
      { id: 'theirs', title: 'Other post', content: 'Not owned', createdAt: '2024-02-01T00:00:00.000Z', authorId: 'other' },
    ]));

    renderHome();

    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute('href', '/edit/mine');
    expect(screen.getAllByRole('link', { name: 'Edit' })).toHaveLength(1);
  });
});
