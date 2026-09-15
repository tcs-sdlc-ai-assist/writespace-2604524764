import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/** Reset the DOM and browser-local test state between test cases. */
afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
