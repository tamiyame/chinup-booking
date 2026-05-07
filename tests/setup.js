import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// localStorage stays consistent: pre-seed token so RequireAuth doesn't redirect
beforeEach(() => {
  localStorage.setItem('chinup.token', 'test-token');
  localStorage.setItem('chinup.user', JSON.stringify({ id: 1, name: '王小明', email: 'a@b.c', role: 'user' }));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// Mock fetch globally — tests override per-route
global.fetchMock = vi.fn();
global.fetch = (...args) => global.fetchMock(...args);

export function jsonResponse(body, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  });
}

export function mockApi(routes) {
  global.fetchMock.mockImplementation(async (url, opts = {}) => {
    const method = opts.method || 'GET';
    const u = typeof url === 'string' ? url : url.url;
    const path = u.replace(/^https?:\/\/[^/]+/, '');
    const key = `${method} ${path}`;
    // exact match first, then regex
    if (routes[key]) return jsonResponse(routes[key]);
    for (const [pattern, body] of Object.entries(routes)) {
      const [m, p] = pattern.split(' ');
      if (m === method) {
        const re = new RegExp('^' + p.replace(/:\w+/g, '[^/?]+').replace(/\?/g, '\\?') + '$');
        const noQuery = path.split('?')[0];
        if (re.test(path) || re.test(noQuery)) return jsonResponse(body);
      }
    }
    return jsonResponse({ error: 'no_mock_for_' + key }, 404);
  });
}
