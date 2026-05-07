import { useState } from 'react';
import { useToast } from '../contexts/ToastContext.jsx';
import { api } from '../api.js';

export default function CourseDrawer({ course, myReg, periodId, onClose, onRegistered, onCancelled }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  if (!course) return null;

  // Build session date list for the period
  const sessionDates = buildSessionDates(course, periodId);

  async function handleRegister() {
    setBusy(true);
    try {
      const r = await api(`/api/courses/${course.id}/register`, {
        method: 'POST',
        body: { period_id: periodId },
      });
      toast(r.status === 'confirmed' ? '🎉 整期報名成功！' : `已進入候補 第 ${r.position} 位`, 'success');
      onRegistered?.();
      onClose();
    } catch (e) {
      toast(e.data?.error === 'already_registered' ? '您已報名本期課程' : `報名失敗：${e.message}`, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel() {
    if (!myReg) return;
    if (!confirm('確定取消本期報名嗎？已上的堂數不退費。')) return;
    setBusy(true);
    try {
      await api(`/api/registrations/${myReg.id}`, { method: 'DELETE' });
      toast('已取消報名', 'success');
      onCancelled?.();
      onClose();
    } catch (e) {
      toast(`取消失敗：${e.message}`, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="hero-eyebrow">{course.tag}・每週{course.dow_label}</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 14, lineHeight: 1.15 }}>
              {course.name}
            </h2>
            <p style={{ color: 'var(--ink-soft)', marginTop: 8 }}>{course.description}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="stat-tile" style={{ padding: '12px 14px' }}>
            <div className="st-label">時段</div>
            <div className="st-value" style={{ fontSize: 18 }}>{course.time}</div>
            <div className="st-meta">{course.duration_minutes} 分鐘</div>
          </div>
          <div className="stat-tile" style={{ padding: '12px 14px' }}>
            <div className="st-label">人數</div>
            <div className="st-value" style={{ fontSize: 18 }}>{course.min_capacity}–{course.max_capacity}</div>
            <div className="st-meta">需 {course.min_capacity} 人成班</div>
          </div>
          <div className="stat-tile" style={{ padding: '12px 14px' }}>
            <div className="st-label">教練</div>
            <div className="st-value" style={{ fontSize: 16 }}>{course.coach_name?.split(' ')[0] ?? '—'}</div>
            <div className="st-meta">{course.coach_tagline ?? ''}</div>
          </div>
        </div>

        {/* Progress bar for enrolled users */}
        {myReg && (
          <div className="card mt-4" style={{ background: 'var(--brand-50)', borderColor: 'rgba(56,189,248,.3)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-700)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              本期進度
            </div>
            <div className="prog-bar">
              <div className="pb-attended" style={{ width: `${(myReg.attended / myReg.total) * 100}%` }} />
              <div className="pb-leave"    style={{ width: `${(myReg.leave    / myReg.total) * 100}%` }} />
              <div className="pb-upcoming" style={{ width: `${(myReg.upcoming / myReg.total) * 100}%` }} />
            </div>
            <div className="flex gap-3 mt-3" style={{ fontSize: 12 }}>
              <span style={{ color: 'var(--brand-700)' }}>● 已上 {myReg.attended}</span>
              <span style={{ color: '#a16207' }}>● 請假 {myReg.leave}</span>
              <span style={{ color: 'var(--ink-mute)' }}>● 未上 {myReg.upcoming}</span>
            </div>
          </div>
        )}

        {/* Session list */}
        <h3 style={{ marginTop: 28, fontSize: 14, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
          整期 {course.sessions_per_period ?? 8} 堂・場次預覽
        </h3>
        <div className="grid gap-2 mt-3">
          {sessionDates.map((dt, i) => (
            <SessionRow key={i} index={i} dt={dt} course={course} myReg={myReg} />
          ))}
        </div>

        {/* Action block */}
        <div className="card mt-5" style={{ background: 'var(--brand-50)', borderColor: 'rgba(56,189,248,.3)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div style={{ fontSize: 11, color: 'var(--brand-700)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>整期方案</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em' }}>
                NT$ {course.price_per_period ?? '—'}
                <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 8, color: 'var(--ink-soft)' }}>/ {course.sessions_per_period ?? 8} 堂</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>請假後可轉讓他人，無法補課</div>
            </div>
            {myReg ? (
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" disabled>已報名</button>
                <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={busy}>取消報名</button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleRegister} disabled={busy}>
                {busy ? '處理中…' : '立即報名整期'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionRow({ index, dt, course, myReg }) {
  const dateStr = dt
    ? `${dt.getMonth() + 1}/${String(dt.getDate()).padStart(2, '0')} 週${['日','一','二','三','四','五','六'][dt.getDay()]} ${course.time}`
    : '—';

  let badge = null;
  if (myReg) {
    if (index < myReg.attended)         badge = <span className="badge badge-completed">已上課</span>;
    else if (index === myReg.attended)  badge = <span className="badge badge-waitlisted">請假</span>;
    else                                badge = <span className="badge badge-confirmed">未上</span>;
  }

  return (
    <div className="flex items-center justify-between" style={{ padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
      <div className="flex items-center gap-3">
        <span style={{ width: 40, fontWeight: 700, color: 'var(--ink-mute)', fontSize: 12 }}>第 {index + 1} 堂</span>
        <span className="text-tabular" style={{ fontWeight: 500 }}>{dateStr}</span>
      </div>
      {badge ?? <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>—</span>}
    </div>
  );
}

// Build 8 session dates starting from period start, on the given DOW
function buildSessionDates(course, periodId) {
  if (!course.dow) return Array(course.sessions_per_period ?? 8).fill(null);
  const year = new Date().getFullYear();
  const periodStartMonth = {
    p1: 0, p2: 2, p3: 4, p4: 6, p5: 8, p6: 10,
  }[periodId] ?? 4;
  let d = new Date(year, periodStartMonth, 1);
  // advance to first occurrence of the target DOW
  while (d.getDay() !== course.dow) d.setDate(d.getDate() + 1);
  const dates = [];
  for (let i = 0; i < (course.sessions_per_period ?? 8); i++) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return dates;
}
