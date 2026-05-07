import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext.jsx';
import LoginPage from '../src/pages/LoginPage.jsx';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>HOME</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

// Tab button (text 登入) and submit button (text 登入) collide on accessible name.
// Pick the submit button via type attribute.
function getSubmitButton() {
  return document.querySelector('button[type="submit"]');
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetchMock.mockReset();
  });

  it('renders login form by default', () => {
    renderLogin();
    expect(screen.getByText('歡迎回來')).toBeInTheDocument();
    expect(screen.getByLabelText('電子郵件')).toBeInTheDocument();
    expect(screen.getByLabelText('密碼')).toBeInTheDocument();
    const submit = getSubmitButton();
    expect(submit).toBeInTheDocument();
    expect(submit.textContent).toContain('登入');
  });

  it('switches to register mode', async () => {
    const user = userEvent.setup();
    renderLogin();
    // Click the "註冊新帳號" tab (no submit button conflict)
    await user.click(screen.getByRole('button', { name: '註冊新帳號' }));

    expect(screen.getByText('建立新帳號')).toBeInTheDocument();
    expect(screen.getByLabelText('姓名')).toBeInTheDocument();
    expect(screen.getByLabelText(/手機/)).toBeInTheDocument();
  });

  it('submits login and stores token', async () => {
    const user = userEvent.setup();
    global.fetchMock.mockResolvedValueOnce({
      ok: true, status: 200,
      json: () => Promise.resolve({ token: 'fake-token', user: { id: 1, name: '小明', role: 'user' } }),
      text: () => Promise.resolve(''),
    });

    renderLogin();
    await user.type(screen.getByLabelText('電子郵件'), 'a@b.c');
    await user.type(screen.getByLabelText('密碼'), 'password123');
    await user.click(getSubmitButton());

    await waitFor(() => expect(localStorage.getItem('chinup.token')).toBe('fake-token'));
  });

  it('shows error message on failed login', async () => {
    const user = userEvent.setup();
    global.fetchMock.mockResolvedValueOnce({
      ok: false, status: 401,
      json: () => Promise.resolve({ error: 'invalid_credentials' }),
      text: () => Promise.resolve(''),
    });

    renderLogin();
    await user.type(screen.getByLabelText('電子郵件'), 'a@b.c');
    await user.type(screen.getByLabelText('密碼'), 'wrong');
    await user.click(getSubmitButton());

    await waitFor(() => expect(screen.getByText('帳號或密碼錯誤')).toBeInTheDocument());
  });
});
