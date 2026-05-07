import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { api, buildPeriods, dateToPeriodId } from '../api.js';

export default function MyCoursesPage() {
  const toast = useToast();
  const periods = buildPeriods();
  const [activePeriod, setActivePeriod] = useState(dateToPeriodId(new Date()));
  const [regs, setRegs] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [activePeriod]);

  async function load() {
    setLoading(true);
    try {
      const [r, a] = await Promise.all([
        api(`/api/my/course-registrations?period_id=${activePeriod}`),
        api(`/api/addons?period_id=${activePeriod}`).catch(() => []),
      ]);
      setRegs(r);
      setAddons(a);
    } catch (e) {
      toast(`載入失敗：${e.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(regId) {
    const code = prompt('請輸入受讓人的會員帳號或 Email：');
    if (!code) return;
    try {
      await api(`/api/registrations/${regId}/transfer`, { method: 'POST', body: { recipient: code } });
      toast('轉讓成功', 'success');
      load();
    } catch (e) {
      toast(`轉讓失敗：${e.message}`, 'error');
    }
  }

  async function handleCancel(regId) {
    if (!confirm('確定取消報名嗎？')) return;
    try {
      await api(`/api/registrations/${regId}`, { method: 'DELETE' });
      toast('已取消報名', 'success');
      load();
    } catch (e) {
      toast(`取消失敗：${e.message}`, 'error');
    }
  }

  async function handleAddonRegister(addonId) {
    try {
      await api(`/api/addons/${addonId}/register`, { method: 'POST' });
      toast('加購成功！', 'success');
      load();
    } catch (e) {
      toast(e.data?.error === 'already_registered' ? '您已加購此場次' : `加購失敗：${e.message}`, 'error');
    }
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <section className="hero">
          <span className="hero-eyebrow">📋 我的課程</span>
          <h1>報名進度總覽</h1>
          <p>檢視已上、未上、請假狀態，並可轉讓未上場次給朋友。</p>
        </section>

        {/* Period rail */}
        <section style={{ paddingBottom: 24 }}>
          <div className="period-rail">
            {periods.map(p => (
              <button
                key={p.id}
                className={`period-pill ${activePeriod === p.id ? 'active' : ''}`}
                onClick={() => setActivePeriod(p.id)}
              >
                <div className="pp-label">{p.label}</div>
                <div className="pp-months">{p.months}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Registrations */}
        <section style={{ paddingBottom: 48 }}>
          {loading ? (
            <div className="grid gap-4">
              {[1,2].map(i => <div key={i} className="card skeleton" style={{ height: 140 }} />)}
            </div>
          ) : regs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">📭</span>
              <p>本期尚未報名任何課程</p>
              <a href="/" className="btn btn-primary mt-3" style={{ display: 'inline-flex', marginTop: 16 }}>瀏覽課程</a>
            </div>
          ) : (
            <div className="grid gap-4">
              {regs.map(r => (
                <RegCard
                  key={r.id}
                  reg={r}
                  onTransfer={() => handleTransfer(r.id)}
                  onCancel={() => handleCancel(r.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Add-on sessions */}
        {addons.length > 0 && (
          <section style={{ paddingBottom: 64 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">單堂加購・近期可選</h2>
              <span className="subtle">限本期報名整期者</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {addons.map(a => (
                <AddonCard key={a.id} addon={a} onRegister={() => handleAddonRegister(a.id)} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function RegCard({ reg, onTransfer, onCancel }) {
  const total    = reg.total ?? 8;
  const attended = reg.attended ?? 0;
  const leave    = reg.leave ?? 0;
  const upcoming = reg.upcoming ?? (total - attended - leave);

  const canTransfer = (reg.transferable ?? 0) > 0;
  const canCancel   = reg.status === 'active' && upcoming > 0;

  return (
    <article className="card">
      <div className="flex items-start gap-5">
        {/* DOW block */}
        <div className="dow-block" style={{ flexShrink: 0 }}>
          <div className="dow-zh">{reg.dow_label ?? '?'}</div>
          <div className="dow-en">{reg.time ?? ''}</div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="card-title">{reg.course_name}</h3>
            <span className="badge badge-confirmed">進行中</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
            {reg.coach_name} · 每週{reg.dow_label} {reg.time}
          </div>

          {/* Progress bar */}
          <div className="prog-bar mt-4">
            <div className="pb-attended" style={{ width: `${(attended / total) * 100}%` }} />
            <div className="pb-leave"    style={{ width: `${(leave    / total) * 100}%` }} />
            <div className="pb-upcoming" style={{ width: `${(upcoming / total) * 100}%` }} />
          </div>
          <div className="flex gap-3 mt-2" style={{ fontSize: 12 }}>
            <span style={{ color: 'var(--brand-700)' }}>● 已上 {attended}</span>
            <span style={{ color: '#a16207' }}>● 請假 {leave}</span>
            <span style={{ color: 'var(--ink-mute)' }}>● 未上 {upcoming}</span>
            {canTransfer && (
              <span style={{ color: 'var(--brand-700)', fontWeight: 600 }}>
                🎟 {reg.transferable} 堂可轉讓
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2" style={{ flexShrink: 0 }}>
          <button className="btn btn-ghost btn-sm">查看場次</button>
          {canTransfer && (
            <button className="btn btn-primary btn-sm" onClick={onTransfer}>轉讓</button>
          )}
          {canCancel && (
            <button className="btn btn-danger btn-sm" onClick={onCancel}>取消</button>
          )}
        </div>
      </div>
    </article>
  );
}

function AddonCard({ addon, onRegister }) {
  return (
    <article className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="card-title">{addon.course_name}</h3>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }} className="text-tabular">
            {addon.date} 週{addon.dow_label} {addon.time}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>尚餘 {addon.available} 個名額</div>
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', flexShrink: 0 }}>
          NT$ {addon.price}
        </span>
      </div>
      <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 14 }} onClick={onRegister}>
        加購此堂
      </button>
    </article>
  );
}
