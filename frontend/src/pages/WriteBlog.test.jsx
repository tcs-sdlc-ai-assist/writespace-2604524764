import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WriteBlog from './WriteBlog';

afterEach(() => {
  vi.restoreAllMocks();
});

/**
 * Render the editor with a destination that exposes navigation outcomes.
 *
 * @param {string} route Editor URL.
 * @returns {object} Testing Library render result.
 */
function renderEditor(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/write" element={<WriteBlog />} />
        <Route path="/edit/:id" element={<WriteBlog />} />
        <Route path="/blog/:id" element={<p>Published post</p>} />
        <Route path="/blogs" element={<p>Blog list</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('WriteBlog', () => {
  it('shows inline required errors when both fields are empty', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));

    renderEditor('/write');
    await user.click(screen.getByRole('button', { name: 'Publish blog' }));

    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Content is required.')).toBeInTheDocument();
  });

  it('creates a post with session-derived author data and persists it', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('crypto', { randomUUID: () => 'new-post' });
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));

    renderEditor('/write');
    await user.type(screen.getByLabelText('Title'), 'A new post');
    await user.type(screen.getByLabelText('Content'), 'New content');
    await user.click(screen.getByRole('button', { name: 'Publish blog' }));

    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))[0]).toMatchObject({
      id: 'new-post', title: 'A new post', content: 'New content', authorId: 'writer', authorName: 'Writer', authorRole: 'user',
    });
    expect(screen.getByText('Published post')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it('keeps the editor open and shows an error when publishing cannot be saved', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'existing', title: 'Existing post' }]));
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    renderEditor('/write');
    await user.type(screen.getByLabelText('Title'), 'A new post');
    await user.type(screen.getByLabelText('Content'), 'New content');
    await user.click(screen.getByRole('button', { name: 'Publish blog' }));

    expect(screen.getByRole('alert')).toHaveTextContent('We could not save your post. Please try again.');
    expect(screen.getByRole('heading', { name: 'Write a blog' })).toBeInTheDocument();
    expect(screen.queryByText('Published post')).not.toBeInTheDocument();
    setItem.mockRestore();
    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))).toEqual([{ id: 'existing', title: 'Existing post' }]);
  });

  it('prefills and updates an authorized author post', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'writer', username: 'writer', displayName: 'Writer', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'post-1', title: 'Original title', content: 'Original content', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer', authorName: 'Writer', authorRole: 'user' },
    ]));

    renderEditor('/edit/post-1');

    expect(screen.getByLabelText('Title')).toHaveValue('Original title');
    await user.clear(screen.getByLabelText('Content'));
    await user.type(screen.getByLabelText('Content'), 'Updated content');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))[0].content).toBe('Updated content');
  });

  it('redirects a non-owner who attempts to edit another author post', () => {
    window.localStorage.setItem('writespace_session', JSON.stringify({ userId: 'reader', username: 'reader', displayName: 'Reader', role: 'user' }));
    window.localStorage.setItem('writespace_posts', JSON.stringify([
      { id: 'post-1', title: 'Original title', content: 'Original content', createdAt: '2024-03-01T00:00:00.000Z', authorId: 'writer' },
    ]));

    renderEditor('/edit/post-1');

    expect(screen.getByText('Blog list')).toBeInTheDocument();
  });
});
