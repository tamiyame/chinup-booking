import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockApi } from './setup.js';
import { AuthProvider } from '../src/contexts/AuthContext.jsx';
import { ToastProvider } from '../src/contexts/ToastContext.jsx';
import MyCoursesPage from '../src/pages/MyCoursesPage.jsx';

const REGS = [
  { id: 101, course_id: 1, course_name: '重量訓練・進階', period_id: 'p3', dow_label: '一', time: '19:00', coach_name: '陳冠宇', total: 8, attended: 5, upcoming: 2, leave: 1, transferable: 1, status: 'active' },
  { id: 102, course_id: 2, course_name: 'TRX 懸吊訓練', period_id: 'p3', dow_label: '二', time: '18:30', coach_name: '林映瑄', total: 8, attended: 4, upcoming: 4, leave: 0, transferable: 0, status: 'active' },
];

const ADDONS = [{ id: 1, course_id: 3, course_name: 'HIIT', date: '2026/05/13', dow_label: '三', time: '19:30', price: 800, available: 4 }];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/my']}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/my" element={<MyCoursesPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('MyCoursesPage', () => {
  beforeEach(() => {
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/my/course-registrations': REGS,
      'GET /api/addons': ADDONS,
    });
  });

  it('renders both registrations with progress breakdown', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());

    expect(screen.getByText('TRX 懸吊訓練')).toBeInTheDocument();
    expect(screen.getByText(/已上 5/)).toBeInTheDocument();
    expect(screen.getByText(/請假 1/)).toBeInTheDocument();
    expect(screen.getByText(/未上 2/)).toBeInTheDocument();
  });

  it('shows transfer button only for transferable regs', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());
    const transferBtns = screen.getAllByText('轉讓');
    expect(transferBtns.length).toBe(1);
  });

  it('renders addon cards', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('HIIT')).toBeInTheDocument());
    expect(screen.getByText(/NT\$ 800/)).toBeInTheDocument();
    expect(screen.getByText('加購此堂')).toBeInTheDocument();
  });

  it('cancels a registration when user confirms', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/my/course-registrations': REGS,
      'GET /api/addons': ADDONS,
      'DELETE /api/registrations/:id': { ok: true },
    });
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());

    const cancelBtns = screen.getAllByText('取消');
    await user.click(cancelBtns[0]);

    await waitFor(() => expect(screen.getByText('已取消報名')).toBeInTheDocument());
  });

  it('shows empty state when no registrations', async () => {
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/my/course-registrations': [],
      'GET /api/addons': [],
    });
    renderPage();
    await waitFor(() => expect(screen.getByText(/本期尚未報名/)).toBeInTheDocument());
    expect(screen.getByText('瀏覽課程')).toBeInTheDocument();
  });
});
