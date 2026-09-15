import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ReadBlog from './ReadBlog';

/**
 * Render a post reader at the requested path.
 *
 * @param {string} route Reader URL.
 * @returns {object} Testing Library render result.
 */
function renderReader(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/blog/:id" element={<ReadBlog />} />
        <Route path="/blogs" element={<p>Blog list</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ReadBlog', () => {
  it('renders the exact missing-post message', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));

    renderReader('/blog/missing');

    expect(screen.getByText('Post not found')).toBeInTheDocument();
  });

  it('hides management actions from another author', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'reader', username: 'reader', displayName: 'Reader', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'owned', title: 'Owner post', content: 'Line one\nLine two', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer', authorName: 'Writer', authorRole: 'user' },
    ]));

    renderReader('/blog/owned');

    expect(screen.getByRole('heading', { name: 'Owner post' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edit post' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete post' })).not.toBeInTheDocument();
  });

  it('lets an administrator confirm-delete any post and redirects to blogs', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'admin', username: 'admin', displayName: 'Admin', role: 'Admin' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'owned', title: 'Owner post', content: 'Text', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer', authorName: 'Writer', authorRole: 'user' },
    ]));

    renderReader('/blog/owned');
    await user.click(screen.getByRole('button', { name: 'Delete post' }));

    expect(window.confirm).toHaveBeenCalledWith('Delete this post?');
    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))).toEqual([]);
    expect(screen.getByText('Blog list')).toBeInTheDocument();
  });
});
