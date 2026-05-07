import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockApi } from './setup.js';
import { AuthProvider } from '../src/contexts/AuthContext.jsx';
import { ToastProvider } from '../src/contexts/ToastContext.jsx';
import CoursesPage from '../src/pages/CoursesPage.jsx';

const COURSES = [
  { id: 1, name: '重量訓練・進階', description: '三大項', dow: 1, dow_label: '一', time: '19:00', duration_minutes: 60, min_capacity: 3, max_capacity: 8, sessions_per_period: 8, price_per_period: 8800, tag: '進階', coach_name: '陳冠宇' },
  { id: 2, name: 'TRX 懸吊訓練', description: '核心', dow: 2, dow_label: '二', time: '18:30', duration_minutes: 50, min_capacity: 4, max_capacity: 10, sessions_per_period: 8, price_per_period: 8000, tag: '入門', coach_name: '林映瑄' },
];

const MY_REGS = [{ id: 101, course_id: 1, course_name: '重量訓練・進階', period_id: 'p3', dow_label: '一', time: '19:00', coach_name: '陳冠宇', total: 8, attended: 5, upcoming: 2, leave: 1, transferable: 1, status: 'active' }];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<CoursesPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('CoursesPage', () => {
  beforeEach(() => {
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/courses': COURSES,
      'GET /api/my/course-registrations': MY_REGS,
    });
  });

  it('shows hero, period rail, and course list', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());

    // Hero (h1 only, not navbar link)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // 6 period pills
    expect(screen.getByText('01–02 月')).toBeInTheDocument();
    expect(screen.getByText('11–12 月')).toBeInTheDocument();

    // Both courses rendered
    expect(screen.getByText('TRX 懸吊訓練')).toBeInTheDocument();

    // Course count
    expect(screen.getByText(/共 2 個帶狀課程/)).toBeInTheDocument();
  });

  it('marks already-registered course as 已報名 with progress', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());
    expect(screen.getByText('已報名')).toBeInTheDocument();
    expect(screen.getByText('5 / 8')).toBeInTheDocument();
  });

  it('opens drawer with course detail and shows register button', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(screen.getByText('TRX 懸吊訓練')).toBeInTheDocument());

    // Click the unregistered course strip card
    await user.click(screen.getByText('TRX 懸吊訓練'));

    // Drawer content
    await waitFor(() => expect(screen.getByText(/整期方案/)).toBeInTheDocument());
    expect(screen.getByText(/NT\$ 8,000|NT\$ 8000/)).toBeInTheDocument();
    expect(screen.getByText('立即報名整期')).toBeInTheDocument();
  });

  it('opens drawer for registered course and shows progress + cancel', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(screen.getByText('重量訓練・進階')).toBeInTheDocument());
    await user.click(screen.getByText('重量訓練・進階'));

    await waitFor(() => expect(screen.getByText('取消報名')).toBeInTheDocument());
    // 本期進度 appears in both strip card and drawer — accept >= 1
    expect(screen.getAllByText(/本期進度/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/已上 5/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/請假 1/).length).toBeGreaterThanOrEqual(1);
  });
});
