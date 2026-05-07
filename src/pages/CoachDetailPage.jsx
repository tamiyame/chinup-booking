import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { CoachAvatar } from '../components/CoachCard.jsx';
import SlotPicker from '../components/SlotPicker.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { api } from '../api.js';

export default function CoachDetailPage() {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [coach, setCoach] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api(`/api/coaches/${coachId}`),
      api(`/api/coaches/${coachId}/slots`),
    ])
      .then(([c, s]) => { setCoach(c); setSlots(s); })
      .catch(e => toast(`載入失敗：${e.message}`, 'error'))
      .finally(() => setLoading(false));
  }, [coachId]);

  async function handleBook(slot) {
    try {
      const booking = await api(`/api/coaches/${coachId}/book`, {
        method: 'POST',
        body: { date: slot.date, time: slot.time },
      });
      navigate('/booking-done', { state: { booking: { ...slot, coachId, coach, ...booking } } });
    } catch (e) {
      toast(`預約失敗：${e.message}`, 'error');
    }
  }

  if (loading) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 200 }} className="skeleton mt-4" />
        </main>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main style={{ maxWidth: 1152, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <p>找不到教練資料</p>
          <button className="btn btn-ghost mt-3" onClick={() => navigate('/coaches')}>← 返回列表</button>
        </main>
      </div>
    );
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        {/* Back */}
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coaches')} style={{ marginTop: 24 }}>
          ← 返回教練列表
        </button>

        {/* Coach info */}
        <section className="hero" style={{ paddingTop: 16, paddingBottom: 24 }}>
          <div className="flex items-start gap-5 flex-wrap">
            <CoachAvatar coach={coach} size={88} />
            <div style={{ flex: 1 }}>
              <span className="hero-eyebrow">{coach.tagline}</span>
              <h1 style={{ marginTop: 12, fontSize: 36 }}>{coach.name?.split(' ')[0]}</h1>
              <div style={{ color: 'var(--ink-soft)', marginTop: 4 }}>{coach.name?.split(' ').slice(1).join(' ')}</div>
              <p style={{ marginTop: 10 }}>{coach.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(coach.tags ?? []).map(t => <span key={t} className="tag-chip">{t}</span>)}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink-mute)' }}>
                {(coach.certifications ?? []).join(' · ')}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>單堂費用</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>
                NT$ {coach.rate_per_session}
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginLeft: 6 }}>/ 60 分</span>
              </div>
            </div>
          </div>
        </section>

        {/* GCal embed shell */}
        <section style={{ paddingBottom: 64 }}>
          <div className="gcal-embed">
            <div className="gcal-embed-head">
              <div className="gcal-tag">
                <CalIcon />
                <span>預約時段・直接整合 Google Calendar</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>calendar.google.com/appointments</span>
            </div>
            <div className="gcal-embed-body">
              <SlotPicker slots={slots} coachId={coachId} onBook={handleBook} />
            </div>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-mute)' }}>
            ※ 預約成功後雙方都會收到 Google 日曆邀請。請確認行事曆邀請以完成預約。
          </p>
        </section>
      </main>
    </div>
  );
}

function CalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
      <rect x="3" y="6" width="26" height="22" rx="2" fill="#fff" stroke="#dadce0" strokeWidth="1.5" />
      <rect x="3" y="6" width="26" height="6" fill="#4285f4" />
      <text x="16" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3c4043">31</text>
    </svg>
  );
}
