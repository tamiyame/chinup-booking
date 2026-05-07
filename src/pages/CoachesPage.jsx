import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import CoachCard from '../components/CoachCard.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { api } from '../api.js';

export default function CoachesPage() {
  const toast = useToast();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/coaches')
      .then(setCoaches)
      .catch(e => toast(`載入失敗：${e.message}`, 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <section className="hero">
          <span className="hero-eyebrow">🏋️ 1-on-1 Personal Training</span>
          <h1>選擇你的專屬教練</h1>
          <p>點選教練查看可預約時段。系統整合 Google Calendar，預約後將自動寄出邀請函。</p>
        </section>

        <section style={{ paddingBottom: 64 }}>
          {loading ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="card skeleton" style={{ height: 280 }} />
              ))}
            </div>
          ) : coaches.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">👥</span>
              <p>目前沒有可預約的教練</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {coaches.map(c => <CoachCard key={c.id} coach={c} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
