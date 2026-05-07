import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { CoachAvatar } from '../components/CoachCard.jsx';
import { addOneHour } from '../api.js';

export default function BookingDonePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    navigate('/coaches');
    return null;
  }

  const coach = booking.coach;

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ maxWidth: 540, margin: '60px auto 80px', textAlign: 'center' }}>
          {/* Success icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--brand-50)', color: 'var(--brand-700)',
            margin: '0 auto 18px',
            display: 'grid', placeItems: 'center',
            fontSize: 32, border: '1px solid rgba(56,189,248,.3)',
          }}>✓</div>

          <h1 style={{ fontSize: 30 }}>預約完成</h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
            已寄送邀請函至你的 Email，請至 Google 行事曆接受。
          </p>

          {/* Booking summary card */}
          <div className="card mt-4" style={{ textAlign: 'left' }}>
            {coach && (
              <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--line)' }}>
                <CoachAvatar coach={coach} size={48} />
                <div>
                  <div className="card-title">{coach.name?.split(' ')[0]}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{coach.tagline}</div>
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Row label="日期" value={`${booking.date} ${booking.day}`} />
              <Row label="時間" value={`${booking.time}–${addOneHour(booking.time)} (60 分鐘)`} />
              <Row label="地點" value="CHINUP Studio" />
              {coach?.rate_per_session && (
                <Row label="費用" value={`NT$ ${coach.rate_per_session}`} bold />
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 justify-center">
            <button className="btn btn-ghost">📅 加入 Google 日曆</button>
            <button className="btn btn-primary" onClick={() => navigate('/coaches')}>完成</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{label}</span>
      <span className={`text-tabular ${bold ? 'font-bold' : 'font-medium'}`} style={{ fontSize: 14 }}>{value}</span>
    </div>
  );
}
