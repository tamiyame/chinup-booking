import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockApi } from './setup.js';
import { AuthProvider } from '../src/contexts/AuthContext.jsx';
import { ToastProvider } from '../src/contexts/ToastContext.jsx';
import CoachesPage from '../src/pages/CoachesPage.jsx';
import CoachDetailPage from '../src/pages/CoachDetailPage.jsx';

const COACHES = [
  { id: 'c1', name: '陳冠宇 Kuan-Yu Chen', tagline: '競技表現', bio: '前國家代表隊', tags: ['爆發力'], certifications: ['NSCA-CSCS'], rate_per_session: 1800 },
  { id: 'c2', name: '林映瑄 Ying-Hsuan Lin', tagline: '一般大眾', bio: '新手友善', tags: ['新手'], certifications: ['ACSM'], rate_per_session: 1500 },
];

const SLOTS = [
  { date: '05/08', day_label: '週五', times: ['09:00', '10:00', '14:00'] },
  { date: '05/09', day_label: '週六', times: ['08:00', '11:00'] },
];

function renderApp(initial = '/coaches') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/coaches" element={<CoachesPage />} />
            <Route path="/coaches/:coachId" element={<CoachDetailPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Coach booking flow', () => {
  beforeEach(() => {
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/coaches': COACHES,
      'GET /api/coaches/c1': COACHES[0],
      'GET /api/coaches/c1/slots': SLOTS,
      'POST /api/coaches/c1/book': { id: 99, gcal_event_id: 'evt-1', invite_sent: true },
    });
  });

  it('renders coach grid with bios and rates', async () => {
    renderApp();
    await waitFor(() => expect(screen.getByText('陳冠宇')).toBeInTheDocument());
    expect(screen.getByText('林映瑄')).toBeInTheDocument();
    expect(screen.getByText('競技表現')).toBeInTheDocument();
    expect(screen.getAllByText('查看時段').length).toBe(2);
  });

  it('navigates to coach detail and shows slot picker', async () => {
    const user = userEvent.setup();
    renderApp();
    await waitFor(() => expect(screen.getByText('陳冠宇')).toBeInTheDocument());

    await user.click(screen.getAllByText('查看時段')[0]);

    await waitFor(() => expect(screen.getByText(/單堂費用/)).toBeInTheDocument());
    expect(screen.getByText(/05\/08/)).toBeInTheDocument();
    expect(screen.getByText(/05\/09/)).toBeInTheDocument();
    // Slot times rendered
    expect(screen.getByRole('button', { name: '14:00' })).toBeInTheDocument();
  });

  it('selects a slot and shows confirm panel', async () => {
    const user = userEvent.setup();
    renderApp('/coaches/c1');
    await waitFor(() => expect(screen.getByRole('button', { name: '14:00' })).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '14:00' }));

    await waitFor(() => expect(screen.getByText(/已選擇時段/)).toBeInTheDocument());
    expect(screen.getByText(/14:00–15:00/)).toBeInTheDocument();
    expect(screen.getByText('確認預約')).toBeInTheDocument();
  });

  it('shows empty state when no slots available', async () => {
    mockApi({
      'GET /api/auth/me': { id: 1, name: '王小明', role: 'user' },
      'GET /api/coaches/c1': COACHES[0],
      'GET /api/coaches/c1/slots': [],
    });
    renderApp('/coaches/c1');
    await waitFor(() => expect(screen.getByText(/目前沒有可預約時段/)).toBeInTheDocument());
  });
});
