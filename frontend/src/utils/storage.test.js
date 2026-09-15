import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPosts, getUsers, savePosts, saveUsers } from './storage';

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe('storage', () => {
  it('returns empty arrays for absent, malformed, and non-array storage values', () => {
    expect(getPosts()).toEqual([]);

    window.localStorage.setItem('writespace_posts', '{not json');
    expect(getPosts()).toEqual([]);

    window.localStorage.setItem('writespace_users', JSON.stringify({ username: 'not-an-array' }));
    expect(getUsers()).toEqual([]);
  });

  it('returns empty arrays when browser storage reads throw', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(getPosts()).toEqual([]);
    expect(getUsers()).toEqual([]);
  });

  it('reports failed writes without changing previously stored records', () => {
    window.localStorage.setItem('writespace_posts', JSON.stringify([{ id: 'existing-post' }]));
    window.localStorage.setItem('writespace_users', JSON.stringify([{ id: 'existing-user' }]));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(savePosts([{ id: 'new-post' }])).toBe(false);
    expect(saveUsers([{ id: 'new-user' }])).toBe(false);

    vi.restoreAllMocks();
    expect(JSON.parse(window.localStorage.getItem('writespace_posts'))).toEqual([{ id: 'existing-post' }]);
    expect(JSON.parse(window.localStorage.getItem('writespace_users'))).toEqual([{ id: 'existing-user' }]);
  });
});
