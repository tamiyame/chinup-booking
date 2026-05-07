/* eslint-disable */
// 方案 B — Calendar-First
// Primary surface = a week-grid calendar showing every weekly course.
// Click a recurring event → opens a side panel for the period
// 報名 / 取消 / 扣補.  1-on-1: coach picker → custom calendar UI
// (NOT iframe) backed by Google Calendar API.

const { useState: useStateB, useMemo: useMemoB } = React;

function PlanB_Nav({ active, onNav }) {
  const links = [
    { id: 'cal', label: '課表行事曆' },
    { id: 'oneonone', label: '一對一' },
    { id: 'mine', label: '我的進度' },
    { id: 'account', label: '帳戶' },
  ];
  return (
    <nav style={{
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'saturate(1.4) blur(12px)',
      borderBottom: '1px solid var(--line)',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div className="max-w-6xl mx-auto px-6" style={{height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div className="flex items-center gap-8">
          <a href="#" className="brand-mark" onClick={(e) => e.preventDefault()}>
            <span className="brand-dot"><img src="assets/logo.png" alt="logo" /></span>
            CHINUP
          </a>
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button key={l.id}
                      onClick={() => onNav(l.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: active === l.id ? 'var(--ink)' : 'transparent',
                        color: active === l.id ? 'white' : 'var(--ink-soft)',
                        fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        transition: 'all 160ms ease',
                      }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm">🔔</button>
          <div className="coach-avatar" style={{width: 32, height: 32, fontSize: 13}}>王</div>
        </div>
      </div>
    </nav>
  );
}

function PeriodBadge({ id, periods }) {
  const p = periods.find(x => x.id === id);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontWeight: 600,
      padding: '4px 10px',
      borderRadius: 9999,
      background: p.status === 'current' ? 'var(--brand-50)' : '#f1f5f9',
      color: p.status === 'current' ? 'var(--brand-700)' : 'var(--ink-soft)',
      border: `1px solid ${p.status === 'current' ? 'rgba(56,189,248,0.3)' : 'var(--line)'}`,
    }}>
      {p.label}・{p.status === 'current' ? '進行中' : (p.status === 'open' ? '報名中' : (p.status === 'past' ? '已結束' : '尚未開放'))}
    </span>
  );
}

function PlanB_Calendar({ onPickCourse, registered }) {
  const { COURSES, WEEK, PERIODS } = window.DATA;
  // hours from 8 to 21
  const HOURS = Array.from({length: 14}, (_, i) => 8 + i);

  // Map courses to grid: position by dow + hour
  const eventByCell = useMemoB(() => {
    const m = new Map();
    COURSES.forEach(c => {
      const [h] = c.time.split(':').map(Number);
      const isMine = registered.some(r => r.courseId === c.id);
      m.set(`${c.dow}-${h}`, { course: c, mine: isMine });
    });
    return m;
  }, [registered]);

  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 28, paddingBottom: 80}}>
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap" style={{marginBottom: 18}}>
        <div>
          <span className="hero-eyebrow">📅 Weekly Schedule</span>
          <h1 style={{fontSize: 36, marginTop: 12, letterSpacing: '-0.03em'}}>2026 / 5 月課表</h1>
          <div style={{marginTop: 8, display: 'flex', gap: 8, alignItems: 'center'}}>
            <PeriodBadge id="p3" periods={PERIODS} />
            <span className="text-sm text-soft">5–6 月期・第 1 / 8 週</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm">‹ 上週</button>
          <span style={{padding: '0 12px', fontSize: 14, fontWeight: 600}}>05/04 – 05/10</span>
          <button className="btn btn-ghost btn-sm">下週 ›</button>
          <div style={{width: 1, height: 24, background: 'var(--line)', margin: '0 8px'}}></div>
          <div style={{display: 'inline-flex', borderRadius: 8, border: '1px solid var(--line)', overflow: 'hidden'}}>
            <button style={{padding: '6px 12px', fontSize: 12, background: 'var(--ink)', color: 'white', border: 'none', cursor: 'pointer'}}>週</button>
            <button style={{padding: '6px 12px', fontSize: 12, background: 'transparent', color: 'var(--ink-soft)', border: 'none', cursor: 'pointer'}}>月</button>
            <button style={{padding: '6px 12px', fontSize: 12, background: 'transparent', color: 'var(--ink-soft)', border: 'none', cursor: 'pointer'}}>列表</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap" style={{marginBottom: 16, fontSize: 12}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 10, height: 10, borderRadius: 3, background: 'var(--brand-600)'}}></span>
          已報名
        </span>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 10, height: 10, borderRadius: 3, background: 'var(--brand-50)', border: '1px solid rgba(56,189,248,0.4)'}}></span>
          可報名・帶狀
        </span>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
          <span style={{width: 10, height: 10, borderRadius: 3, background: '#fef3c7', border: '1px solid #fcd34d'}}></span>
          一對一可預約
        </span>
      </div>

      {/* Calendar grid */}
      <div className="cal-week">
        {/* Header row */}
        <div className="cal-h" style={{background: '#f8faf9', borderRight: '1px solid var(--line)'}}></div>
        {WEEK.map((d, i) => (
          <div key={i} className={`cal-h ${d.date === '05/06' ? 'today' : ''}`} style={{borderRight: i === 6 ? 'none' : '1px solid var(--line)'}}>
            <div>週{d.dowLabel}</div>
            <div className="cal-h-num text-tabular">{d.date}</div>
          </div>
        ))}
        {/* Time rows */}
        {HOURS.map((h, hi) => (
          <React.Fragment key={h}>
            <div className="cal-tlabel">{h}:00</div>
            {WEEK.map((d, i) => {
              const evt = eventByCell.get(`${d.dow}-${h}`);
              return (
                <div key={i} className="cal-cell" style={{borderRight: i === 6 ? 'none' : '1px solid var(--line)'}}>
                  {evt && (
                    <div
                      className={`cal-event ${evt.mine ? 'evt-mine' : 'evt-class'}`}
                      style={{top: 4, height: evt.course.duration === 60 ? 76 : (evt.course.duration === 50 ? 64 : 56)}}
                      onClick={() => onPickCourse(evt.course)}>
                      <div className="cev-time text-tabular">{evt.course.time}</div>
                      <div style={{lineHeight: 1.2, marginTop: 2}}>{evt.course.name}</div>
                      <div className="cev-time" style={{marginTop: 3, opacity: 0.75}}>👥 {evt.course.min}–{evt.course.max}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Period switcher */}
      <div style={{marginTop: 28}}>
        <h2 className="section-title" style={{marginBottom: 12}}>切換期數</h2>
        <PeriodRailB />
      </div>
    </main>
  );
}

function PeriodRailB() {
  const { PERIODS } = window.DATA;
  const [active, setActive] = useStateB('p3');
  const statusColor = {
    past: { bg: '#f1f5f9', fg: '#64748b' },
    current: { bg: 'var(--brand-50)', fg: 'var(--brand-700)' },
    open: { bg: '#ecfdf5', fg: '#047857' },
    soon: { bg: '#fffbeb', fg: '#a16207' },
  };
  return (
    <div className="grid gap-2" style={{gridTemplateColumns: 'repeat(6, 1fr)'}}>
      {PERIODS.map(p => {
        const sc = statusColor[p.status];
        const isActive = active === p.id;
        return (
          <button key={p.id}
                  onClick={() => setActive(p.id)}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    background: isActive ? 'var(--ink)' : 'var(--surface)',
                    color: isActive ? 'white' : 'var(--ink)',
                    border: `1px solid ${isActive ? 'var(--ink)' : 'var(--line)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms ease',
                  }}>
            <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: isActive ? 0.7 : 0.5}}>
              {p.label}
            </div>
            <div style={{fontSize: 14, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em'}}>{p.months}</div>
            <span style={{
              display: 'inline-block', marginTop: 8,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
              padding: '2px 8px', borderRadius: 9999,
              background: isActive ? 'rgba(255,255,255,0.15)' : sc.bg,
              color: isActive ? 'white' : sc.fg,
            }}>
              {p.status === 'past' ? '已結束' : p.status === 'current' ? '進行中' : p.status === 'open' ? '報名中' : '尚未開放'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PlanB_CoursePanel({ course, onClose, registered, onRegister, onCancel }) {
  if (!course) return null;
  const coach = window.DATA.coachById(course.coach);
  const myReg = registered.find(r => r.courseId === course.id);
  const dates = useMemoB(() => {
    const arr = [];
    let d = new Date(2026, 4, 4);
    while (d.getDay() !== course.dow) d.setDate(d.getDate() + 1);
    for (let i = 0; i < course.sessions; i++) {
      const dt = new Date(d);
      dt.setDate(dt.getDate() + i * 7);
      arr.push(dt);
    }
    return arr;
  }, [course]);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between" style={{marginBottom: 18}}>
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="tag-chip">{course.tag}</span>
              <span style={{fontSize: 12, color: 'var(--ink-mute)', fontWeight: 500}}>每週{course.dowLabel} {course.time} · {course.duration} 分鐘</span>
            </div>
            <h2 style={{fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15}}>{course.name}</h2>
            <p className="text-soft mt-2" style={{fontSize: 14}}>{course.desc}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>

        {/* Coach */}
        <div className="card" style={{padding: 16}}>
          <div className="flex items-center gap-3">
            <div className="coach-avatar" style={{width: 48, height: 48, fontSize: 18}}>{coach.name.charAt(0)}</div>
            <div className="flex-1">
              <div style={{fontWeight: 700}}>{coach.name.split(' ')[0]}</div>
              <div className="text-xs text-mute">{coach.tagline}</div>
            </div>
            <button className="btn btn-ghost btn-sm">查看簡介</button>
          </div>
        </div>

        {/* Status block */}
        {myReg ? (
          <div style={{marginTop: 16, padding: 18, background: 'var(--brand-50)', borderRadius: 12, border: '1px solid rgba(56,189,248,0.3)'}}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <div style={{fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-700)'}}>
                  你的進度
                </div>
                <div style={{fontSize: 24, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em'}}>
                  已上 {myReg.attended} / {myReg.total} 堂
                </div>
                <div className="text-sm text-soft mt-1">
                  剩 {myReg.upcoming} 堂・請假 {myReg.leave} 堂{myReg.transferable > 0 && `・🎟 ${myReg.transferable} 堂可轉讓`}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => onCancel(course.id)}>取消整期</button>
                <button className="btn btn-ghost btn-sm">轉讓給朋友</button>
              </div>
            </div>
            <div className="prog-bar" style={{marginTop: 14}}>
              <div className="pb-attended" style={{width: `${(myReg.attended/myReg.total)*100}%`}}></div>
              <div className="pb-leave" style={{width: `${(myReg.leave/myReg.total)*100}%`}}></div>
              <div className="pb-upcoming" style={{width: `${(myReg.upcoming/myReg.total)*100}%`}}></div>
            </div>
          </div>
        ) : (
          <div style={{marginTop: 16, padding: 18, background: 'var(--ink)', borderRadius: 12, color: 'white'}}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65}}>
                  整期 8 堂
                </div>
                <div style={{fontSize: 30, fontWeight: 800, marginTop: 4, letterSpacing: '-0.03em'}}>
                  NT$ 8,800
                </div>
                <div style={{opacity: 0.75, fontSize: 13, marginTop: 4}}>每堂 NT$ 1,100・限本期報名</div>
              </div>
              <button className="btn btn-primary" onClick={() => onRegister(course.id)}>立即報名整期</button>
            </div>
          </div>
        )}

        {/* Sessions list */}
        <h3 style={{marginTop: 22, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)'}}>
          場次清單・5–6 月期
        </h3>
        <div className="grid gap-2 mt-3">
          {dates.map((dt, i) => {
            let statusEl = null;
            if (myReg) {
              if (i < myReg.attended) statusEl = <span className="badge badge-completed">已上課</span>;
              else if (i === myReg.attended + 1 && myReg.leave > 0) statusEl = <span className="badge badge-waitlisted">請假・可轉讓</span>;
              else statusEl = <span className="badge badge-confirmed">未上</span>;
            } else {
              statusEl = <span className="text-xs text-mute">—</span>;
            }
            return (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                background: i === 4 ? '#f8faf9' : 'transparent',
                border: '1px solid var(--line)',
                borderRadius: 10,
              }}>
                <div className="flex items-center gap-3">
                  <span style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'var(--brand-50)', color: 'var(--brand-700)',
                    fontWeight: 700, fontSize: 13,
                    display: 'grid', placeItems: 'center',
                  }}>{i+1}</span>
                  <span className="text-tabular text-sm font-medium">
                    {dt.getMonth()+1}/{String(dt.getDate()).padStart(2,'0')} {course.time}
                  </span>
                </div>
                {statusEl}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlanB_Coaches({ onPickCoach }) {
  const { COACHES } = window.DATA;
  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 32, paddingBottom: 60}}>
      <div style={{marginBottom: 28}}>
        <span className="hero-eyebrow">🏋️ Personal Training</span>
        <h1 style={{fontSize: 36, marginTop: 12, letterSpacing: '-0.03em'}}>選擇你的專屬教練</h1>
        <p className="text-soft" style={{maxWidth: 580, marginTop: 8}}>每位教練的可預約時段直接同步自 Google 行事曆。預約成功後，你和教練都會收到行事曆邀請。</p>
      </div>

      <div className="grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'}}>
        {COACHES.map(c => (
          <article key={c.id} className="coach-card" onClick={() => onPickCoach(c.id)}>
            <div className="flex items-center gap-3">
              <div className="coach-avatar">{c.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="cc-name">{c.name.split(' ')[0]}</div>
                <div className="cc-tag mt-1">{c.tagline}</div>
              </div>
            </div>
            <div className="cc-bio">{c.bio}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>
            <div className="flex items-center justify-between" style={{paddingTop: 14, borderTop: '1px solid var(--line)', marginTop: 'auto'}}>
              <div className="text-tabular">
                <div className="text-xs text-mute">本週可約</div>
                <div className="text-lg font-bold" style={{letterSpacing: '-0.02em'}}>
                  {(window.DATA.SLOTS[c.id] || []).reduce((n, d) => n + d.times.length, 0)} 個時段
                </div>
              </div>
              <button className="btn btn-primary btn-sm">預約 →</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function PlanB_CoachBooking({ coachId, onBack, onBook }) {
  const c = window.DATA.coachById(coachId);
  const slots = window.DATA.SLOTS[coachId] || [];
  const [pickedDate, setPickedDate] = useStateB(slots[0]?.date || null);
  const [pickedTime, setPickedTime] = useStateB(null);
  const [duration, setDuration] = useStateB(60);

  const dayObj = slots.find(s => s.date === pickedDate);

  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 24, paddingBottom: 80}}>
      <button className="btn btn-ghost btn-sm" onClick={onBack}>← 返回教練列表</button>

      <div className="grid gap-6" style={{gridTemplateColumns: 'minmax(0, 360px) 1fr', marginTop: 18}}>
        {/* Left: coach info */}
        <aside>
          <div className="card" style={{padding: 24}}>
            <div className="coach-avatar" style={{width: 88, height: 88, fontSize: 32, marginBottom: 16}}>{c.name.charAt(0)}</div>
            <div className="cc-name" style={{fontSize: 22}}>{c.name.split(' ')[0]}</div>
            <div className="cc-name-en">{c.name.split(' ').slice(1).join(' ')}</div>
            <div className="cc-tag mt-1">{c.tagline}</div>
            <div className="cc-bio" style={{marginTop: 14}}>{c.bio}</div>

            <div className="divider-line"></div>

            <div className="text-xs text-soft" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8}}>專長</div>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>

            <div className="divider-line"></div>

            <div className="text-xs text-soft" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8}}>證照</div>
            <div className="text-sm text-tabular">{c.cert.join(' · ')}</div>

            <div className="divider-line"></div>

            <div style={{
              padding: 14, background: 'var(--brand-50)',
              borderRadius: 10, border: '1px solid rgba(56,189,248,0.25)'
            }}>
              <div className="text-xs" style={{color: 'var(--brand-700)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>單堂費用</div>
              <div className="text-lg font-bold mt-1" style={{letterSpacing: '-0.02em'}}>
                NT$ {c.rate}<span className="text-xs font-medium text-soft" style={{marginLeft: 6}}>/ 60 分</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: booking flow */}
        <div>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 style={{fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em'}}>選擇時段</h2>
            <div className="flex items-center gap-2 text-xs text-soft">
              <svg width="14" height="14" viewBox="0 0 32 32" style={{flexShrink: 0}}>
                <rect x="3" y="6" width="26" height="22" rx="2" fill="#fff" stroke="#dadce0" strokeWidth="1.5"/>
                <rect x="3" y="6" width="26" height="6" fill="#4285f4"/>
              </svg>
              即時同步 Google Calendar
            </div>
          </div>

          {/* Duration toggle */}
          <div style={{display: 'inline-flex', borderRadius: 8, border: '1px solid var(--line)', overflow: 'hidden', marginBottom: 18}}>
            {[30, 60, 90].map(d => (
              <button key={d}
                      onClick={() => setDuration(d)}
                      style={{
                        padding: '8px 16px', fontSize: 13, fontWeight: 600,
                        background: duration === d ? 'var(--ink)' : 'var(--surface)',
                        color: duration === d ? 'white' : 'var(--ink-soft)',
                        border: 'none', cursor: 'pointer',
                      }}>
                {d} 分鐘
              </button>
            ))}
          </div>

          {/* Date strip */}
          <div className="flex gap-2 overflow-x-auto pb-2" style={{marginBottom: 18}}>
            {slots.map(s => (
              <button key={s.date}
                      onClick={() => { setPickedDate(s.date); setPickedTime(null); }}
                      style={{
                        flex: '0 0 auto',
                        padding: '12px 18px',
                        background: pickedDate === s.date ? 'var(--brand-600)' : 'var(--surface)',
                        color: pickedDate === s.date ? 'white' : 'var(--ink)',
                        border: `1px solid ${pickedDate === s.date ? 'var(--brand-600)' : 'var(--line)'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        textAlign: 'center',
                        minWidth: 72,
                      }}>
                <div className="text-xs" style={{opacity: pickedDate === s.date ? 0.85 : 0.6, fontWeight: 600}}>{s.day}</div>
                <div className="text-tabular" style={{fontSize: 18, fontWeight: 800, marginTop: 2, letterSpacing: '-0.02em'}}>{s.date}</div>
                <div className="text-xs mt-1" style={{opacity: pickedDate === s.date ? 0.85 : 0.55}}>{s.times.length} 時段</div>
              </button>
            ))}
          </div>

          {/* Time grid */}
          {dayObj && (
            <div>
              <div className="text-xs text-soft" style={{fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10}}>
                {dayObj.date} {dayObj.day}・上午 / 下午
              </div>
              <div className="grid gap-2" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))'}}>
                {[...Array(14)].map((_, i) => {
                  const h = 8 + i;
                  const time = `${String(h).padStart(2,'0')}:00`;
                  const available = dayObj.times.includes(time);
                  return (
                    <button key={time}
                            disabled={!available}
                            className={`slot-btn ${pickedTime === time ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                            onClick={() => setPickedTime(time)}>
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm */}
          {pickedTime && (
            <div className="card" style={{marginTop: 22, padding: 22, background: 'var(--ink)', color: 'white', borderColor: 'var(--ink)'}}>
              <div className="text-xs" style={{opacity: 0.65, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                即將預約
              </div>
              <div className="flex items-center justify-between flex-wrap gap-3" style={{marginTop: 8}}>
                <div>
                  <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em'}}>
                    <span className="text-tabular">{pickedDate}</span> {dayObj.day} {pickedTime}
                  </div>
                  <div style={{opacity: 0.7, fontSize: 13, marginTop: 4}}>{c.name.split(' ')[0]} · {duration} 分鐘 · NT$ {Math.round(c.rate * duration / 60)}</div>
                </div>
                <button className="btn btn-primary" onClick={() => onBook({ coachId, date: pickedDate, time: pickedTime, day: dayObj.day, duration })}>
                  確認並寄送 Google Calendar 邀請
                </button>
              </div>
            </div>
          )}

          {/* Calendar API hint */}
          <div className="card" style={{marginTop: 16, padding: 14, background: '#f8faf9', borderStyle: 'dashed'}}>
            <div className="flex items-start gap-3">
              <span style={{fontSize: 18}}>⚙️</span>
              <div className="text-xs text-soft" style={{lineHeight: 1.6}}>
                <strong>整合方式：</strong>使用 Google Calendar API（FreeBusy 查詢 + Events insert with Google Meet）。
                時段為教練在 Google 行事曆中標記為「Available」的區段。預約完成後系統會建立行事曆事件並自動發送邀請。
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function PlanB_BookingDone({ booking, onDone }) {
  const c = window.DATA.coachById(booking.coachId);
  return (
    <main className="max-w-6xl mx-auto px-6" style={{paddingTop: 60, paddingBottom: 80}}>
      <div style={{maxWidth: 600, margin: '0 auto'}}>
        <div className="card" style={{padding: 32, textAlign: 'center', borderColor: 'rgba(56,189,248,0.3)', background: 'linear-gradient(180deg, var(--brand-50), var(--surface) 60%)'}}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--brand-600)', color: 'white',
            margin: '0 auto 18px',
            display: 'grid', placeItems: 'center',
            fontSize: 32, boxShadow: 'var(--shadow-brand)',
          }}>✓</div>
          <h1 style={{fontSize: 28}}>預約完成</h1>
          <p style={{marginTop: 8}}>邀請函已寄至你的 Email。Google Meet 連結會在課前 1 小時自動產生。</p>

          <div style={{
            marginTop: 24, padding: 18,
            background: 'var(--surface)',
            borderRadius: 12, border: '1px solid var(--line)',
            textAlign: 'left',
          }}>
            <div className="flex items-center gap-3 mb-3 pb-3" style={{borderBottom: '1px solid var(--line)'}}>
              <div className="coach-avatar" style={{width: 44, height: 44, fontSize: 16}}>{c.name.charAt(0)}</div>
              <div>
                <div style={{fontWeight: 700}}>{c.name.split(' ')[0]}</div>
                <div className="text-xs text-mute">{c.tagline}</div>
              </div>
            </div>
            <div className="grid gap-2" style={{fontSize: 14}}>
              <div className="flex justify-between"><span className="text-soft">日期</span><span className="text-tabular font-medium">{booking.date} {booking.day}</span></div>
              <div className="flex justify-between"><span className="text-soft">時間</span><span className="text-tabular font-medium">{booking.time} · {booking.duration} 分鐘</span></div>
              <div className="flex justify-between"><span className="text-soft">地點</span><span className="font-medium">CHINUP Studio</span></div>
              <div className="flex justify-between"><span className="text-soft">費用</span><span className="font-bold">NT$ {Math.round(c.rate * booking.duration / 60)}</span></div>
            </div>
          </div>

          <div className="flex gap-2 mt-5 justify-center">
            <button className="btn btn-ghost">📅 查看 Google 行事曆</button>
            <button className="btn btn-primary" onClick={onDone}>完成</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function PlanB() {
  const [page, setPage] = useStateB('cal');
  const [openCourse, setOpenCourse] = useStateB(null);
  const [registered, setRegistered] = useStateB(window.DATA.MY_REGS);
  const [pickedCoach, setPickedCoach] = useStateB(null);
  const [booking, setBooking] = useStateB(null);

  const handleNav = (id) => {
    if (id === 'cal') setPage('cal');
    if (id === 'oneonone') { setPage('coaches'); setPickedCoach(null); setBooking(null); }
    if (id === 'mine') setPage('cal'); // for the demo
  };

  const handleRegister = (cid) => {
    setRegistered(prev => [...prev, {
      id: Date.now(), courseId: cid, period: 'p3',
      total: 8, attended: 0, upcoming: 8, leave: 0, transferable: 0,
    }]);
    setOpenCourse(null);
  };
  const handleCancel = (cid) => {
    setRegistered(prev => prev.filter(r => r.courseId !== cid));
    setOpenCourse(null);
  };

  return (
    <div className="mobile-screen" style={{minHeight: 900}}>
      <PlanB_Nav active={page === 'coaches' ? 'oneonone' : 'cal'} onNav={handleNav} />
      {page === 'cal' && (
        <PlanB_Calendar onPickCourse={setOpenCourse} registered={registered} />
      )}
      {page === 'coaches' && !pickedCoach && (
        <PlanB_Coaches onPickCoach={setPickedCoach} />
      )}
      {page === 'coaches' && pickedCoach && !booking && (
        <PlanB_CoachBooking coachId={pickedCoach}
                            onBack={() => setPickedCoach(null)}
                            onBook={setBooking} />
      )}
      {page === 'coaches' && booking && (
        <PlanB_BookingDone booking={booking} onDone={() => { setBooking(null); setPickedCoach(null); }} />
      )}
      <PlanB_CoursePanel
        course={openCourse}
        registered={registered}
        onClose={() => setOpenCourse(null)}
        onRegister={handleRegister}
        onCancel={handleCancel}
      />
    </div>
  );
}

window.PlanB = PlanB;
