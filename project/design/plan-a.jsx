/* eslint-disable */
// 方案 A — Classic List
// Faithful extension of the existing UI kit.
// Period rail at top → list of weekly courses → tap one for detail
// drawer with sessions + 報名/取消/扣補 status.
// 1-on-1: coach grid → coach detail with embedded Google Calendar
// Appointment Schedule iframe (mocked).

const { useState: useStateA, useMemo: useMemoA } = React;

function PlanA_Nav({ active, onNav, t }) {
  const links = [
    { id: 'home', label: '帶狀課程' },
    { id: 'oneonone', label: '一對一教練' },
    { id: 'mine', label: '我的課程' },
    { id: 'account', label: '帳戶' },
  ];
  return (
    <nav className="navbar sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="brand-mark" onClick={(e) => e.preventDefault()}>
            <span className="brand-dot"><img src="assets/logo.png" alt="logo" /></span>
            CHINUP Performance
          </a>
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <a key={l.id}
                 onClick={(e) => { e.preventDefault(); onNav(l.id); }}
                 className={`nav-link ${active === l.id ? 'active' : ''}`}
                 href="#">{l.label}</a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-confirmed" style={{ fontSize: 10 }}>會員</span>
          <span className="text-sm font-medium">王小明</span>
        </div>
      </div>
    </nav>
  );
}

function PeriodRail({ periods, active, onPick }) {
  const statusLabel = {
    past: '已結束', current: '進行中', open: '報名中', soon: '尚未開放',
  };
  return (
    <div className="period-rail">
      {periods.map(p => (
        <button key={p.id}
                className={`period-pill ${active === p.id ? 'active' : ''}`}
                onClick={() => onPick(p.id)}>
          <div className="pp-label">{p.label}</div>
          <div className="pp-months">{p.months}</div>
          <div className="pp-meta">{statusLabel[p.status]}</div>
        </button>
      ))}
    </div>
  );
}

function StripCard({ c, onClick, myReg }) {
  const coach = window.DATA.coachById(c.coach);
  return (
    <div className="strip-card" onClick={onClick}>
      <div className="dow-block">
        <div>
          <div className="dow-zh">{c.dowLabel}</div>
          <div className="dow-en">{['SUN','MON','TUE','WED','THU','FRI','SAT'][c.dow]}</div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="sc-title">{c.name}</h3>
          <span className="tag-chip">{c.tag}</span>
          {myReg && <span className="badge badge-confirmed">已報名</span>}
        </div>
        <div className="sc-desc">{c.desc}</div>
        <div className="sc-meta">
          <span>🕐 {c.time}・{c.duration} 分鐘</span>
          <span>👥 {c.min}–{c.max} 人</span>
          <span>👨‍🏫 {coach.name.split(' ')[0]}</span>
        </div>
      </div>
      <div className="text-right">
        {myReg ? (
          <div>
            <div className="text-xs" style={{color: 'var(--ink-mute)'}}>本期進度</div>
            <div className="text-lg font-bold mt-1" style={{letterSpacing: '-0.02em'}}>
              {myReg.attended} / {myReg.total}
            </div>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            查看詳情
          </button>
        )}
      </div>
    </div>
  );
}

function CourseDetailDrawer({ course, onClose, onRegister, registered }) {
  if (!course) return null;
  const coach = window.DATA.coachById(course.coach);
  // mock dates for the period
  const dates = [];
  let d = new Date(2026, 4, 4); // May 4 2026 = Monday
  while (d.getDay() !== course.dow) d.setDate(d.getDate() + 1);
  for (let i = 0; i < course.sessions; i++) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + i * 7);
    dates.push(dt);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="hero-eyebrow">{course.tag}・每週{course.dowLabel}</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 14, lineHeight: 1.15 }}>
              {course.name}
            </h2>
            <p className="text-soft" style={{ marginTop: 8 }}>{course.desc}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="stat-tile" style={{padding: '12px 14px'}}>
            <div className="st-label">時段</div>
            <div className="st-value" style={{fontSize: 18}}>{course.time}</div>
            <div className="st-meta">{course.duration} 分鐘</div>
          </div>
          <div className="stat-tile" style={{padding: '12px 14px'}}>
            <div className="st-label">人數</div>
            <div className="st-value" style={{fontSize: 18}}>{course.min}–{course.max}</div>
            <div className="st-meta">需 {course.min} 人成班</div>
          </div>
          <div className="stat-tile" style={{padding: '12px 14px'}}>
            <div className="st-label">教練</div>
            <div className="st-value" style={{fontSize: 16}}>{coach.name.split(' ')[0]}</div>
            <div className="st-meta">{coach.tagline}</div>
          </div>
        </div>

        <h3 style={{ marginTop: 28, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
          整期 8 堂・場次預覽
        </h3>
        <div className="grid gap-2 mt-3">
          {dates.map((dt, i) => (
            <div key={i} className="flex items-center justify-between" style={{padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 10}}>
              <div className="flex items-center gap-3">
                <span style={{width: 30, fontWeight: 700, color: 'var(--ink-mute)', fontSize: 12}}>第 {i+1} 堂</span>
                <span className="text-tabular font-medium">
                  {dt.getMonth()+1}/{String(dt.getDate()).padStart(2,'0')} 週{course.dowLabel} {course.time}
                </span>
              </div>
              {i === 4 && registered && <span className="badge badge-waitlisted">請假</span>}
              {i < 4 && registered && <span className="badge badge-completed">已上課</span>}
              {i >= 5 && registered && <span className="badge badge-confirmed">未上</span>}
              {!registered && <span className="text-xs text-mute">—</span>}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 20, background: 'var(--brand-50)', borderColor: 'rgba(56,189,248,0.3)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs" style={{color: 'var(--brand-700)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>整期方案</div>
              <div style={{fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing: '-0.02em'}}>
                NT$ 8,800<span style={{fontSize: 13, fontWeight: 500, marginLeft: 8, color: 'var(--ink-soft)'}}>/ 8 堂</span>
              </div>
              <div className="text-xs text-soft mt-1">請假後可轉讓他人，無法補課</div>
            </div>
            {registered ? (
              <button className="btn btn-ghost">已報名・查看狀態</button>
            ) : (
              <button className="btn btn-primary" onClick={onRegister}>立即報名整期</button>
            )}
          </div>
          <div className="divider-line" style={{margin: '14px 0'}} />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{color: 'var(--ink-soft)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase'}}>單堂加購</div>
              <div className="text-sm mt-1">NT$ 1,200 / 堂・限報名整期者</div>
            </div>
            <button className="btn btn-ghost btn-sm" disabled={!registered}>選擇場次</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanA_Home({ onOpenCourse, registered }) {
  const [activePeriod, setActivePeriod] = useStateA('p3');
  const { COURSES, PERIODS } = window.DATA;
  return (
    <main className="max-w-6xl mx-auto px-6">
      <section className="hero">
        <span className="hero-eyebrow">💪 2026 Spring Program</span>
        <h1 dangerouslySetInnerHTML={{ __html: '帶狀團體課程<br/>每兩個月一期，每週固定上課' }} />
        <p>由專業教練設計的循環課表，每期 8 堂、每週同一時段。請假後額度可轉讓給朋友，請於開課前完成。</p>
      </section>
      <section style={{ paddingBottom: 24 }}>
        <PeriodRail periods={PERIODS} active={activePeriod} onPick={setActivePeriod} />
      </section>
      <section style={{ paddingBottom: 64 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">本期課表・週一至週六</h2>
          <span className="subtle">共 {COURSES.length} 個帶狀課程</span>
        </div>
        <div className="grid gap-3">
          {COURSES.map(c => (
            <StripCard key={c.id} c={c} onClick={() => onOpenCourse(c)} myReg={registered.find(r => r.courseId === c.id)} />
          ))}
        </div>
      </section>
    </main>
  );
}

function PlanA_Mine({ registered }) {
  const { COURSES, ADDONS, courseById } = window.DATA;
  return (
    <main className="max-w-6xl mx-auto px-6">
      <section className="hero">
        <span className="hero-eyebrow">📋 我的課程</span>
        <h1>本期 5–6 月進度</h1>
        <p>檢視已上、未上、請假狀態，並可轉讓未上場次給朋友。</p>
      </section>
      <section className="grid gap-4 pb-12">
        {registered.map(r => {
          const c = courseById(r.courseId);
          const coach = window.DATA.coachById(c.coach);
          const attendedPct = (r.attended / r.total) * 100;
          const upcomingPct = (r.upcoming / r.total) * 100;
          const leavePct = (r.leave / r.total) * 100;
          return (
            <article key={r.id} className="card">
              <div className="flex items-start gap-5">
                <div className="dow-block">
                  <div>
                    <div className="dow-zh">{c.dowLabel}</div>
                    <div className="dow-en">{c.time.replace(':','')}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="card-title">{c.name}</h3>
                    <span className="badge badge-confirmed">進行中</span>
                  </div>
                  <div className="text-sm text-soft mt-1">{coach.name.split(' ')[0]}・每週{c.dowLabel} {c.time}</div>
                  <div className="prog-bar mt-4">
                    <div className="pb-attended" style={{width: `${attendedPct}%`}}></div>
                    <div className="pb-leave" style={{width: `${leavePct}%`}}></div>
                    <div className="pb-upcoming" style={{width: `${upcomingPct}%`}}></div>
                  </div>
                  <div className="meta" style={{marginTop: 10, fontSize: 12}}>
                    <span className="meta-item" style={{color: 'var(--brand-700)'}}>● 已上 {r.attended}</span>
                    <span className="meta-item" style={{color: '#a16207'}}>● 請假 {r.leave}</span>
                    <span className="meta-item" style={{color: 'var(--ink-mute)'}}>● 未上 {r.upcoming}</span>
                    {r.transferable > 0 && (
                      <span className="meta-item" style={{color: 'var(--brand-700)', fontWeight: 600}}>
                        🎟 {r.transferable} 堂可轉讓
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-ghost btn-sm">查看場次</button>
                  {r.transferable > 0 && (
                    <button className="btn btn-primary btn-sm">轉讓</button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <section className="pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">單堂加購・近期可選</h2>
          <span className="subtle">限本期報名整期者</span>
        </div>
        <div className="grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
          {ADDONS.map(a => {
            const c = courseById(a.courseId);
            return (
              <article key={a.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="card-title">{c.name}</h3>
                    <div className="text-sm text-soft mt-1 text-tabular">{a.date} 週{c.dowLabel} {a.time}</div>
                    <div className="text-xs text-mute mt-1">尚餘 {a.available} 個名額</div>
                  </div>
                  <span className="text-lg font-bold" style={{letterSpacing: '-0.02em'}}>NT$ {a.price}</span>
                </div>
                <button className="btn btn-primary btn-sm w-full" style={{marginTop: 14, width: '100%'}}>加購</button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function PlanA_Coaches({ onPickCoach }) {
  const { COACHES } = window.DATA;
  return (
    <main className="max-w-6xl mx-auto px-6">
      <section className="hero">
        <span className="hero-eyebrow">🏋️ 1-on-1 Personal Training</span>
        <h1>選擇你的專屬教練</h1>
        <p>點選教練查看可預約時段。系統整合 Google Calendar，預約後將自動寄出邀請函。</p>
      </section>
      <section className="pb-16 grid gap-4" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'}}>
        {COACHES.map(c => (
          <article key={c.id} className="coach-card" onClick={() => onPickCoach(c.id)}>
            <div className="flex items-start gap-3">
              <div className="coach-avatar">{c.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="cc-name">{c.name.split(' ')[0]}</div>
                <div className="cc-name-en">{c.name.split(' ').slice(1).join(' ')}</div>
                <div className="cc-tag mt-1">{c.tagline}</div>
              </div>
            </div>
            <div className="cc-bio">{c.bio}</div>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>
            <div className="flex items-center justify-between" style={{paddingTop: 14, borderTop: '1px solid var(--line)'}}>
              <div>
                <div className="text-xs text-mute">證照</div>
                <div className="text-xs font-medium mt-0.5">{c.cert.join(' · ')}</div>
              </div>
              <button className="btn btn-primary btn-sm">查看時段</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

// 方案 A — Google Calendar EMBED (Appointment Schedule iframe)
function PlanA_CoachDetail({ coachId, onBack, onBook }) {
  const c = window.DATA.coachById(coachId);
  return (
    <main className="max-w-6xl mx-auto px-6">
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{marginTop: 24}}>← 返回教練列表</button>
      <section className="hero" style={{paddingTop: 16, paddingBottom: 24}}>
        <div className="flex items-start gap-5">
          <div className="coach-avatar" style={{width: 88, height: 88, fontSize: 32}}>{c.name.charAt(0)}</div>
          <div className="flex-1">
            <span className="hero-eyebrow">{c.tagline}</span>
            <h1 style={{marginTop: 12, fontSize: 36}}>{c.name.split(' ')[0]}</h1>
            <div className="text-soft mt-1">{c.name.split(' ').slice(1).join(' ')}</div>
            <p style={{marginTop: 10}}>{c.bio}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {c.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-mute">單堂費用</div>
            <div className="text-lg font-bold" style={{letterSpacing: '-0.02em', marginTop: 4}}>
              NT$ {c.rate}<span className="text-xs font-medium text-soft" style={{marginLeft: 6}}>/ 60 分</span>
            </div>
          </div>
        </div>
      </section>

      {/* The mock embed */}
      <section className="pb-16">
        <div className="gcal-embed">
          <div className="gcal-embed-head">
            <div className="gcal-tag">
              <svg width="18" height="18" viewBox="0 0 32 32" style={{flexShrink: 0}}>
                <rect x="3" y="6" width="26" height="22" rx="2" fill="#fff" stroke="#dadce0" strokeWidth="1.5"/>
                <rect x="3" y="6" width="26" height="6" fill="#4285f4"/>
                <text x="16" y="22" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3c4043">31</text>
              </svg>
              <span>由 Google 行事曆預約功能驅動・直接嵌入頁面</span>
            </div>
            <span className="text-xs text-mute">calendar.google.com/appointments</span>
          </div>
          <div className="gcal-embed-body">
            <GCalAppointmentMock coachId={coachId} onBook={onBook} />
          </div>
        </div>
        <p className="text-xs text-mute" style={{marginTop: 12}}>
          ※ 此區塊為 Google Calendar 提供的「Appointment Schedule」嵌入頁，會自動讀取教練行事曆中設定的可預約時段。預約成功後雙方都會收到日曆邀請。
        </p>
      </section>
    </main>
  );
}

// Mock of a Google Calendar Appointment Schedule embed
function GCalAppointmentMock({ coachId, onBook }) {
  const slots = window.DATA.SLOTS[coachId] || [];
  const [picked, setPicked] = useStateA(null);

  return (
    <div>
      <div className="flex items-center justify-between" style={{marginBottom: 18, padding: '8px 12px', background: '#f8faf9', borderRadius: 10, border: '1px solid var(--line)'}}>
        <div>
          <div style={{fontWeight: 700, fontSize: 15}}>一對一個人訓練</div>
          <div className="text-xs text-mute mt-0.5">60 分鐘・會在地點: CHINUP Studio</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-soft">
          <span>‹</span>
          <span style={{fontWeight: 600}}>2026 年 5 月</span>
          <span>›</span>
        </div>
      </div>

      <div className="grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))'}}>
        {slots.map(d => (
          <div key={d.date} className="slot-day">
            <div className="slot-day-h">
              <div className="sd-date text-tabular">{d.date}</div>
              <div className="sd-day">{d.day}</div>
            </div>
            <div className="slot-grid">
              {d.times.map(t => (
                <button key={t}
                        className={`slot-btn text-tabular ${picked && picked.date === d.date && picked.time === t ? 'selected' : ''}`}
                        onClick={() => setPicked({ date: d.date, day: d.day, time: t })}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {picked && (
        <div style={{marginTop: 20, padding: 18, background: 'var(--brand-50)', borderRadius: 12, border: '1px solid rgba(56,189,248,0.3)'}}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs" style={{color: 'var(--brand-700)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>已選擇時段</div>
              <div style={{fontSize: 18, fontWeight: 800, marginTop: 4, letterSpacing: '-0.01em'}}>
                <span className="text-tabular">{picked.date}</span> {picked.day} {picked.time}–{addHour(picked.time)}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setPicked(null)}>更換</button>
              <button className="btn btn-primary" onClick={() => onBook({...picked, coachId})}>確認預約</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function addHour(time) {
  const [h, m] = time.split(':').map(Number);
  return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function PlanA_BookingDone({ booking, onDone }) {
  const c = window.DATA.coachById(booking.coachId);
  return (
    <main className="max-w-6xl mx-auto px-6">
      <div style={{maxWidth: 540, margin: '60px auto 80px', textAlign: 'center'}}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--brand-50)', color: 'var(--brand-700)',
          margin: '0 auto 18px',
          display: 'grid', placeItems: 'center',
          fontSize: 32, border: '1px solid rgba(56,189,248,0.3)'
        }}>✓</div>
        <h1 style={{fontSize: 30}}>預約完成</h1>
        <p className="mt-2">已寄送邀請函至你的 Email，請至 Google 行事曆接受。</p>

        <div className="card" style={{marginTop: 28, textAlign: 'left'}}>
          <div className="flex items-center gap-3 mb-4 pb-4" style={{borderBottom: '1px solid var(--line)'}}>
            <div className="coach-avatar" style={{width: 48, height: 48, fontSize: 18}}>{c.name.charAt(0)}</div>
            <div>
              <div className="card-title">{c.name.split(' ')[0]}</div>
              <div className="text-sm text-soft">{c.tagline}</div>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between"><span className="text-soft text-sm">日期</span><span className="text-tabular font-medium">{booking.date} {booking.day}</span></div>
            <div className="flex justify-between"><span className="text-soft text-sm">時間</span><span className="text-tabular font-medium">{booking.time}–{addHour(booking.time)} (60 分鐘)</span></div>
            <div className="flex justify-between"><span className="text-soft text-sm">地點</span><span className="font-medium">CHINUP Studio</span></div>
            <div className="flex justify-between"><span className="text-soft text-sm">費用</span><span className="font-bold">NT$ {c.rate}</span></div>
          </div>
        </div>

        <div className="flex gap-2 mt-5 justify-center">
          <button className="btn btn-ghost">📅 加入 Google 日曆</button>
          <button className="btn btn-primary" onClick={onDone}>完成</button>
        </div>
      </div>
    </main>
  );
}

function PlanA() {
  const [page, setPage] = useStateA('home');
  const [openCourse, setOpenCourse] = useStateA(null);
  const [registered, setRegistered] = useStateA(window.DATA.MY_REGS);
  const [pickedCoach, setPickedCoach] = useStateA(null);
  const [booking, setBooking] = useStateA(null);

  const handleRegister = () => {
    if (!openCourse) return;
    setRegistered(prev => [...prev, {
      id: Date.now(), courseId: openCourse.id, period: 'p3',
      total: 8, attended: 0, upcoming: 8, leave: 0, transferable: 0,
      status: 'active'
    }]);
    setOpenCourse(null);
  };

  return (
    <div className="mobile-screen" style={{minHeight: 900}}>
      <PlanA_Nav active={page} onNav={(id) => {
        if (id === 'home') setPage('home');
        if (id === 'oneonone') { setPage('coaches'); setPickedCoach(null); setBooking(null); }
        if (id === 'mine') setPage('mine');
      }} />
      {page === 'home' && (
        <PlanA_Home onOpenCourse={setOpenCourse} registered={registered} />
      )}
      {page === 'mine' && (
        <PlanA_Mine registered={registered} />
      )}
      {page === 'coaches' && !pickedCoach && (
        <PlanA_Coaches onPickCoach={setPickedCoach} />
      )}
      {page === 'coaches' && pickedCoach && !booking && (
        <PlanA_CoachDetail coachId={pickedCoach}
                           onBack={() => setPickedCoach(null)}
                           onBook={setBooking} />
      )}
      {page === 'coaches' && booking && (
        <PlanA_BookingDone booking={booking} onDone={() => { setBooking(null); setPickedCoach(null); }} />
      )}
      <CourseDetailDrawer
        course={openCourse}
        onClose={() => setOpenCourse(null)}
        onRegister={handleRegister}
        registered={openCourse && registered.find(r => r.courseId === openCourse.id)}
      />
    </div>
  );
}

window.PlanA = PlanA;
