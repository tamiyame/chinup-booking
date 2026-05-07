import { useState } from 'react';
import { addOneHour } from '../api.js';

export default function SlotPicker({ slots, onBook, coachId }) {
  const [picked, setPicked] = useState(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4"
           style={{ padding: '8px 12px', background: '#f8faf9', borderRadius: 10, border: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>一對一個人訓練</div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>60 分鐘・地點：CHINUP Studio</div>
        </div>
        <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
          <span>‹</span>
          <span style={{ fontWeight: 600 }}>{currentMonthLabel()}</span>
          <span>›</span>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📅</span>
          <p>目前沒有可預約時段</p>
          <p className="subtle mt-1">請稍後再查看</p>
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {slots.map(day => (
            <div key={day.date} className="slot-day">
              <div className="slot-day-h">
                <div className="sd-date text-tabular">{day.date}</div>
                <div className="sd-day">{day.day_label}</div>
              </div>
              <div className="slot-grid">
                {day.times.map(t => (
                  <button
                    key={t}
                    className={`slot-btn text-tabular ${picked?.date === day.date && picked?.time === t ? 'selected' : ''}`}
                    onClick={() => setPicked({ date: day.date, day: day.day_label, time: t, coachId })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {picked && (
        <div style={{ marginTop: 20, padding: 18, background: 'var(--brand-50)', borderRadius: 12, border: '1px solid rgba(56,189,248,.3)' }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div style={{ fontSize: 11, color: 'var(--brand-700)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                已選擇時段
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, letterSpacing: '-0.01em' }}>
                <span className="text-tabular">{picked.date}</span> {picked.day} {picked.time}–{addOneHour(picked.time)}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setPicked(null)}>更換</button>
              <button className="btn btn-primary" onClick={() => onBook(picked)}>確認預約</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function currentMonthLabel() {
  const d = new Date();
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}
