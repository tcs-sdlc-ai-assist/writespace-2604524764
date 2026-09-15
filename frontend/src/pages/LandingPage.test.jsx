import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import LandingPage from './LandingPage';

/**
 * Render a component inside the router required by public navigation links.
 *
 * @param {JSX.Element} component Component under test.
 * @param {string} route Initial route location.
 * @returns {object} Testing Library render result.
 */
function renderWithRouter(component, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>,
  );
}

describe('LandingPage', () => {
  it('shows public navigation, discovery content, and the exact empty post message', () => {
    renderWithRouter(<LandingPage />);

    expect(screen.getAllByRole('link', { name: 'Login' })).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'WriteSpace', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Write Freely')).toBeInTheDocument();
    expect(screen.getByText('Private & Local')).toBeInTheDocument();
    expect(screen.getByText('Instant & Fast')).toBeInTheDocument();
    expect(screen.getByText('No posts yet — check back soon!')).toBeInTheDocument();
  });

  it('shows at most three locally stored posts in newest-first order', () => {
    window.localStorage.setItem(
      'writespace_posts',
      JSON.stringify([
        { id: 'old', title: 'Oldest reflection', content: 'Old content', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'new', title: 'Newest reflection', content: 'New content', createdAt: '2024-04-01T00:00:00.000Z' },
        { id: 'middle', title: 'Middle reflection', content: 'Middle content', createdAt: '2024-02-01T00:00:00.000Z' },
        { id: 'later', title: 'Later reflection', content: 'Later content', createdAt: '2024-03-01T00:00:00.000Z' },
      ]),
    );

    renderWithRouter(<LandingPage />);

    const previewTitles = screen
      .getAllByRole('link', { name: 'Read post' })
      .map((link) => link.closest('article').querySelector('h3').textContent);
    expect(previewTitles).toEqual(['Newest reflection', 'Later reflection', 'Middle reflection']);
    expect(screen.queryByText('Oldest reflection')).not.toBeInTheDocument();
  });

  it('redirects a guest following a public post link to login', () => {
    window.localStorage.setItem(
      'writespace_posts',
      JSON.stringify([
        { id: 'post-1', title: 'Guest-protected post', content: 'Preview only', createdAt: '2024-04-01T00:00:00.000Z' },
      ]),
    );

    renderWithRouter(<App />, '/blog/post-1');

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
